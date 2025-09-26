# Backend-Frontend Integration Guide

## Overview

This guide explains how the React frontend integrates with the NestJS backend, covering API communication, authentication flow, data synchronization, and deployment coordination.

---

## Architecture Overview

```
Frontend (React)          Backend (NestJS)
├── Vite Dev Server       ├── NestJS Server
│   Port: 5173           │   Port: 8000
├── API Layer            ├── API Endpoints
│   └── RTK Query        │   └── REST API
├── Authentication       ├── JWT Auth
│   └── Cookie-based     │   └── Passport.js
└── State Management     └── Database
    └── Redux Store          └── PostgreSQL + Prisma
```

---

## API Integration Setup

### 1. Environment Configuration

#### Frontend Configuration (`.env.local`)
```bash
# API Base URL - must match backend server
VITE_API_BASE_URL=http://localhost:8000/api

# Development settings
VITE_NODE_ENV=development
```

#### Backend Configuration (`.env`)
```bash
# Server configuration
PORT=8000

# CORS - must include frontend URL
CORS_ORIGIN=http://localhost:5173

# Database and other backend configs...
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
CLOUDINARY_CLOUD_NAME="..."
```

### 2. CORS Configuration

#### Backend CORS Setup (`main.ts`)
```typescript
// NestJS CORS configuration
app.enableCors({
  origin: function (origin, callback) {
    const whitelist = ['http://localhost:5173']; // Frontend URL
    
    const isLocalhost = /^http:\/\/localhost:(\d+)$/.test(origin);
    
    if (!origin || whitelist.indexOf(origin) !== -1 || isLocalhost) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Important for cookie-based auth
});
```

### 3. API Base URL Configuration

#### Frontend API Setup (`apiSlice.ts`)
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Images', 'User'],
  endpoints: () => ({}),
});
```

---

## Authentication Integration

### 1. Authentication Flow

```
1. User Login (Frontend)
   ↓
2. POST /api/auth/login (Backend)
   ↓
3. JWT Token Generated (Backend)
   ↓
4. Token Stored in HTTP-only Cookie (Backend)
   ↓
5. Success Response (Backend → Frontend)
   ↓
6. Redirect to Gallery (Frontend)
   ↓
7. Subsequent API Calls Include Cookie (Automatic)
```

### 2. Frontend Authentication Implementation

#### Login Service (`api/services/auth.ts`)
```typescript
import { apiSlice } from '../apiSlice';
import Cookies from 'js-cookie';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Token is automatically stored in HTTP-only cookie by backend
          // No client-side token storage needed
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    
    getProfile: builder.query<UserProfile, void>({
      query: () => '/user/profile',
      // This will automatically include the authentication cookie
    }),
  }),
});
```

#### Authentication Context (`providers/AuthProvider.tsx`)
```typescript
export const AuthProvider = ({ children }) => {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  
  const contextValue = {
    user: profile?.data || null,
    isAuthenticated: !!profile?.data && !error,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. Backend Authentication Setup

#### JWT Strategy (`auth/strategies/jwt.strategy.ts`)
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Extract JWT from cookie
          return request?.cookies?.token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

#### Login Controller (`auth/auth.controller.ts`)
```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(credentials);
    
    // Set HTTP-only cookie
    response.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { access_token };
  }
}
```

---

## Image Management Integration

### 1. Image Upload Flow

```
1. User Selects Files (Frontend Dropzone)
   ↓
2. FormData Creation (Frontend)
   ↓
3. POST /api/images/upload (Frontend → Backend)
   ↓
4. Cloudinary Upload + AI Analysis (Backend)
   ↓
5. Database Storage (Backend)
   ↓
6. Success Response (Backend → Frontend)
   ↓
7. Cache Invalidation (Frontend RTK Query)
   ↓
8. UI Update (Frontend Re-fetch)
```

### 2. Frontend Image Upload

#### Image Upload Component (`components/common/ImageUpload/index.tsx`)
```typescript
export const ImageUpload = ({ onUpload, onClose }) => {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const handleDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await uploadImages(formData).unwrap();
      onUpload(); // Trigger success callback
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()} className="upload-area">
          <input {...getInputProps()} />
          {isDragActive ? 'Drop files here' : 'Drag & drop images'}
        </div>
      )}
    </Dropzone>
  );
};
```

#### Image Service (`api/services/images.ts`)
```typescript
export const imageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/images/upload',
        method: 'POST',
        body: formData,
        // Don't set Content-Type - let browser set it for FormData
      }),
      invalidatesTags: ['Images'], // Invalidate images cache
    }),
    
    getImages: builder.query<PaginatedImagesResponse, ImageQueryParams>({
      query: ({ page, limit, color, search, similarTo }) => {
        let url = `/images?page=${page}&limit=${limit}`;
        if (color) url += `&color=${color}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (similarTo) url += `&similarTo=${similarTo}`;
        return url;
      },
      providesTags: ['Images'],
    }),
  }),
});
```

### 3. Backend Image Processing

#### Image Controller (`modules/image/image.controller.ts`)
```typescript
@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    return this.imageService.uploadImages(files, req.user.userId);
  }

  @Get()
  async getImages(
    @Query() filterDto: ImageFilterDto,
    @Request() req,
  ) {
    return this.imageService.getImagesByUserId(req.user.userId, filterDto);
  }
}
```

---

## Real-time Data Synchronization

### 1. Cache Management Strategy

#### RTK Query Cache Tags
```typescript
// Tag-based cache invalidation
providesTags: (result, error, arg) => [
  { type: 'Images', id: 'LIST' },
  ...result?.items?.map(({ id }) => ({ type: 'Images', id })) || []
],

invalidatesTags: [
  { type: 'Images', id: 'LIST' }
]
```

#### Automatic Background Refetching
```typescript
// Configure refetching behavior
getImages: builder.query({
  // ... query config
  keepUnusedDataFor: 60, // Keep cache for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30s
  refetchOnFocus: true, // Refetch when window regains focus
  refetchOnReconnect: true, // Refetch when internet reconnects
})
```

### 2. Optimistic Updates

#### Optimistic Image Upload
```typescript
const uploadImages = useMutation({
  mutationFn: (formData: FormData) => uploadImagesMutation(formData),
  onMutate: async (formData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['images']);
    
    // Snapshot previous value
    const previousImages = queryClient.getQueryData(['images']);
    
    // Optimistically update cache with preview
    queryClient.setQueryData(['images'], (old) => ({
      ...old,
      items: [
        ...createPreviewImages(formData), // Show previews
        ...old.items
      ]
    }));
    
    return { previousImages };
  },
  onError: (err, formData, context) => {
    // Rollback on error
    queryClient.setQueryData(['images'], context.previousImages);
  },
  onSettled: () => {
    // Always refetch after mutation
    queryClient.invalidateQueries(['images']);
  }
});
```

---

## Error Handling Integration

### 1. Centralized Error Handling

#### API Error Interceptor
```typescript
// Global error handling in baseQuery
baseQuery: async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  })(args, api, extraOptions);
  
  if (result.error) {
    const { status, data } = result.error;
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden - show error message
        messageApi.error('Access denied');
        break;
      case 500:
        // Server error
        messageApi.error('Server error occurred');
        break;
      default:
        messageApi.error(data?.message || 'An error occurred');
    }
  }
  
  return result;
};
```

### 2. Backend Error Formatting

#### Exception Filter (`common/filters/http-exception.filter.ts`)
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : 500;
      
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : message,
    });
  }
}
```

---

## Development Workflow

### 1. Local Development Setup

#### Start Both Services
```bash
# Terminal 1 - Backend
cd hipaa-testing
npm run start:dev  # Runs on http://localhost:8000

# Terminal 2 - Frontend  
cd imageGallery
npm run dev       # Runs on http://localhost:5173
```

#### Verify Integration
1. **Backend Health**: Visit `http://localhost:8000/api` 
2. **Frontend Access**: Visit `http://localhost:5173`
3. **API Connectivity**: Check browser network tab for API calls
4. **Authentication**: Test login/logout functionality

### 2. Hot Reload Coordination

#### Frontend Hot Reload
- Vite HMR automatically reloads on file changes
- API calls continue to work during frontend reloads
- Redux state persists during hot reloads (with Redux DevTools)

#### Backend Hot Reload
- NestJS watch mode automatically restarts on file changes
- Frontend automatically retries failed requests after backend restart
- RTK Query handles temporary connection failures gracefully

---

## Production Deployment

### 1. Environment Coordination

#### Production Environment Variables

**Frontend (Build time)**
```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_NODE_ENV=production
```

**Backend (Runtime)**
```bash
# Production .env
PORT=8000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://prod_user:password@prod_host:5432/prod_db
JWT_SECRET=your-production-jwt-secret
```

### 2. Deployment Architecture Options

#### Option 1: Same Domain Deployment
```
https://yourdomain.com/          → Frontend (Static)
https://yourdomain.com/api/      → Backend (Dynamic)
```

**Advantages**:
- No CORS issues
- Simplified authentication
- Single SSL certificate

**Implementation**:
```nginx
# Nginx configuration
server {
  listen 443 ssl;
  server_name yourdomain.com;
  
  # Frontend static files
  location / {
    root /var/www/frontend/dist;
    try_files $uri $uri/ /index.html;
  }
  
  # Backend API
  location /api/ {
    proxy_pass http://localhost:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

#### Option 2: Subdomain Deployment
```
https://app.yourdomain.com/      → Frontend
https://api.yourdomain.com/      → Backend
```

**Advantages**:
- Service separation
- Independent scaling
- Clear API versioning

**CORS Configuration**:
```typescript
// Backend CORS for subdomain
app.enableCors({
  origin: ['https://app.yourdomain.com'],
  credentials: true,
});
```

### 3. Docker Deployment

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### Docker Compose Coordination
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: 
      context: ./imageGallery
      args:
        VITE_API_BASE_URL: http://localhost:8000/api
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./hipaa-testing
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/hipaa_testing
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: hipaa_testing
      POSTGRES_USER: postgres  
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## API Documentation Integration

### 1. OpenAPI/Swagger Setup (Backend)

#### Swagger Configuration
```typescript
// swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Image Gallery API')
    .setDescription('AI-powered image management API')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
```

### 2. TypeScript Type Generation

#### Generate Frontend Types from Backend
```bash
# Install OpenAPI generator
npm install -D @openapitools/openapi-generator-cli

# Generate TypeScript types
npx openapi-generator-cli generate \
  -i http://localhost:8000/api-docs-json \
  -g typescript-axios \
  -o ./src/api/generated
```

---

## Testing Integration

### 1. API Contract Testing

#### Frontend API Tests
```typescript
// Test API integration
import { renderHook, waitFor } from '@testing-library/react';
import { useGetImagesQuery } from '../api/services/images';
import { createTestWrapper } from '../test-utils/wrapper';

describe('Image API Integration', () => {
  it('should fetch images successfully', async () => {
    const { result } = renderHook(
      () => useGetImagesQuery({ page: 1, limit: 12 }),
      { wrapper: createTestWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.items).toHaveLength(12);
    });
  });
});
```

#### Backend API Tests
```typescript
// E2E API testing
describe('Images API (e2e)', () => {
  it('/images/upload (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/images/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('files', 'test/fixtures/test-image.jpg')
      .expect(201);

    expect(response.body).toHaveProperty('items');
  });
});
```

### 2. Mock Server for Development

#### MSW (Mock Service Worker) Setup
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ access_token: 'mock-jwt-token' })
    );
  }),
  
  rest.get('/api/images', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: mockImages,
        meta: { total: 100, page: 1, limit: 12 }
      })
    );
  }),
];
```

---

## Monitoring & Debugging

### 1. Development Debugging

#### Frontend Debugging
```typescript
// Redux DevTools configuration
export const store = configureStore({
  reducer: { api: apiSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// API call logging
baseQuery: async (args, api, extraOptions) => {
  console.log('API Call:', args);
  const result = await fetchBaseQuery(args, api, extraOptions);
  console.log('API Response:', result);
  return result;
};
```

#### Backend Debugging
```typescript
// Request/Response logging
app.use(morgan('combined'));

// API endpoint logging
@Controller('images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);
  
  @Get()
  async getImages(@Query() filterDto: ImageFilterDto) {
    this.logger.log(`Fetching images with filters: ${JSON.stringify(filterDto)}`);
    return this.imageService.getImages(filterDto);
  }
}
```

### 2. Production Monitoring

#### Error Tracking Integration
```typescript
// Frontend error tracking (Sentry example)
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Backend error tracking
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Troubleshooting Guide

### Common Integration Issues

#### 1. CORS Errors
**Symptom**: "Access to fetch blocked by CORS policy"
**Solutions**:
- Verify backend CORS configuration includes frontend URL
- Check `credentials: 'include'` in frontend API calls
- Ensure backend allows credentials in CORS settings

#### 2. Authentication Cookie Issues
**Symptom**: User logged in but API calls return 401
**Solutions**:
- Verify cookie is being set with correct domain/path
- Check `httpOnly`, `secure`, and `sameSite` cookie settings
- Ensure frontend includes credentials in API calls

#### 3. File Upload Failures
**Symptom**: Image uploads fail or timeout
**Solutions**:
- Check backend file size limits
- Verify Cloudinary configuration
- Check network tab for request/response details
- Ensure proper FormData construction

#### 4. API Endpoint Not Found
**Symptom**: 404 errors for API calls
**Solutions**:
- Verify API base URL configuration
- Check backend route registration
- Ensure proper API versioning/prefixes

### Debugging Checklist

#### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify network tab for failed API calls
- [ ] Check Redux DevTools for state issues
- [ ] Verify environment variables are loaded
- [ ] Test API endpoints directly in browser/Postman

#### Backend Issues  
- [ ] Check server logs for errors
- [ ] Verify database connection
- [ ] Test endpoints with curl/Postman
- [ ] Check authentication middleware
- [ ] Verify CORS configuration

#### Integration Issues
- [ ] Verify both services are running
- [ ] Check API base URL configuration
- [ ] Test CORS with browser dev tools
- [ ] Verify authentication flow end-to-end
- [ ] Check cookie settings and transmission

---

## Performance Optimization

### 1. API Performance

#### Request Optimization
```typescript
// Debounced search to reduce API calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// In component
const debouncedSearch = useDebounce(searchQuery, 300);
const { data } = useGetImagesQuery({ search: debouncedSearch });
```

#### Caching Strategy
```typescript
// Optimize cache configuration
getImages: builder.query({
  query: (params) => ({ url: '/images', params }),
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnMountOrArgChange: 60, // 1 minute
  transformResponse: (response: any) => {
    // Transform and normalize data
    return {
      items: response.items.map(normalizeImage),
      meta: response.meta,
    };
  },
});
```

### 2. Bundle Optimization

#### Code Splitting
```typescript
// Lazy load heavy components
const ImageEditor = lazy(() => 
  import('../components/ImageEditor').then(module => ({
    default: module.ImageEditor
  }))
);

// Route-level code splitting
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
```

---

This integration guide provides a comprehensive overview of how the frontend and backend work together. Regular updates to this document will ensure it stays current with the evolving architecture and requirements.
