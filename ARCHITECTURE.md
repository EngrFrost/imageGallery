# Frontend Architecture Document

## Project Overview

The **Image Gallery Frontend** is a modern React application built with TypeScript, providing a responsive and intuitive interface for the AI-powered image management system. The architecture emphasizes performance, maintainability, and user experience.

---

## Technology Stack & Architecture Decisions

### Core Framework Decision: React 19 + TypeScript

**Choice**: React 19 with TypeScript
**Rationale**:
- **React 19**: Latest concurrent features, improved performance, and better developer experience
- **TypeScript**: Type safety reduces bugs, improves developer productivity, and enables better refactoring
- **Mature Ecosystem**: Extensive library support and community resources
- **Component-Based**: Natural fit for reusable UI components

### Build Tool: Vite

**Choice**: Vite over Create React App or Webpack
**Rationale**:
- **Lightning Fast**: Sub-second hot module replacement (HMR)
- **Modern Standards**: Native ES modules, built-in TypeScript support
- **Optimized Builds**: Rollup-based production builds with code splitting
- **Plugin Ecosystem**: Rich plugin system for extensibility
- **Future-Proof**: Aligned with modern web standards

### UI Framework: Ant Design + Tailwind CSS

**Choice**: Hybrid approach with Ant Design components and Tailwind utilities
**Rationale**:
- **Ant Design**: Enterprise-grade components, consistent design system, comprehensive functionality
- **Tailwind CSS**: Utility-first approach for custom styling, responsive design utilities
- **Best of Both Worlds**: Pre-built components + flexible styling
- **Design Consistency**: Maintains visual consistency while allowing customization

---

## Architecture Patterns

### 1. Feature-Based Architecture

```
src/
├── components/
│   ├── common/          # Shared UI components
│   ├── gallery/         # Gallery-specific components  
│   ├── core/           # Authentication components
│   └── formElements/   # Form-related components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── api/                # API layer and services
├── store/              # State management
├── router/             # Routing configuration
├── providers/          # Context providers
└── utils/              # Utility functions
```

**Benefits**:
- Clear separation of concerns
- Easy to locate and modify features
- Scalable as the application grows
- Promotes code reusability

### 2. Component Composition Pattern

**Implementation**: Higher-order components and render props
**Example**:
```typescript
// Layout composition
<AppLayout>
  <GalleryPage>
    <GalleryFilters />
    <GalleryList />
  </GalleryPage>
</AppLayout>
```

**Benefits**:
- Flexible component reuse
- Clear component hierarchy
- Easy to test individual components
- Maintainable component structure

### 3. Custom Hooks Pattern

**Implementation**: Business logic extracted into reusable hooks
**Examples**:
- `useAuth`: Authentication state and actions
- `useGalleryState`: Gallery state management and API interactions

**Benefits**:
- Separates business logic from UI components
- Promotes code reuse across components
- Easier unit testing of business logic
- Cleaner component code

---

## State Management Architecture

### Redux Toolkit Query (RTK Query)

**Choice**: RTK Query over traditional Redux or other solutions
**Rationale**:
- **Built-in Caching**: Automatic API response caching with invalidation
- **Loading States**: Automatic loading, error, and success states
- **Code Generation**: Automatic hook generation from API endpoints
- **Performance**: Optimized re-renders and background refetching
- **DevTools Integration**: Excellent debugging experience

### State Structure

```typescript
// Global State (Redux)
{
  api: {
    queries: {
      'getImages({"page":1,"limit":12})': {
        data: PaginatedImagesResponse,
        status: 'fulfilled' | 'pending' | 'rejected'
      }
    },
    mutations: {
      'uploadImages': {
        status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
      }
    }
  }
}

// Local State (React Context)
AuthContext: {
  user: User | null,
  isAuthenticated: boolean,
  login: (credentials) => Promise<void>,
  logout: () => void
}
```

### Data Flow Architecture

```
Component → Hook → RTK Query → API → Backend
    ↓         ↓        ↓         ↓
  Render ← Cache ← Response ← HTTP
```

**Flow Explanation**:
1. **Component** calls custom hook (e.g., `useGalleryState`)
2. **Hook** uses RTK Query hooks for API calls
3. **RTK Query** manages caching and API communication
4. **API layer** handles HTTP requests and response formatting
5. **Backend** processes requests and returns data

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── AuthProvider (Context)
├── Router
│   ├── ProtectedRoute
│   │   └── AppLayout
│   │       ├── AppHeader
│   │       ├── Sidebar (future)
│   │       └── GalleryPage
│   │           ├── GalleryFilters
│   │           ├── GalleryList
│   │           ├── ImageUpload (Modal)
│   │           └── ImageDetailModal
│   ├── LoginPage
│   └── SignupPage
```

### Component Design Principles

#### 1. Single Responsibility Principle
Each component has a single, well-defined purpose:
- `GalleryList`: Displays image grid
- `GalleryFilters`: Handles search and filtering
- `ImageCard`: Displays individual image with metadata

#### 2. Composition Over Inheritance
Components are composed rather than inherited:
```typescript
// Good: Composition
<ImageCard>
  <ImageCard.Image src={image.secureUrl} />
  <ImageCard.Metadata tags={image.metadata.tags} />
  <ImageCard.Actions onView={onView} onSimilar={onSimilar} />
</ImageCard>

// Avoid: Complex inheritance hierarchies
```

#### 3. Props Interface Design
Clear, typed interfaces for all component props:
```typescript
interface GalleryListProps {
  images: Image[];
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (image: Image) => void;
}
```

### Component Categories

#### 1. Common Components (`src/components/common/`)
**Purpose**: Reusable UI components across the application
**Examples**:
- `Button`: Custom button with consistent styling
- `ImageCard`: Image display with overlay actions
- `Pagination`: Page navigation component
- `Skeleton`: Loading placeholders

#### 2. Gallery Components (`src/components/gallery/`)
**Purpose**: Gallery-specific functionality
**Examples**:
- `GalleryList`: Main image grid display
- `GalleryFilters`: Search and filter controls
- `GalleryStatusBanner`: Status messages and empty states

#### 3. Form Components (`src/components/formElements/`)
**Purpose**: Form-related functionality with React Hook Form integration
**Examples**:
- `FormInput`: Input field with validation
- `FormSubmit`: Submit button with loading states
- `FormLabel`: Consistent form labels

---

## API Architecture

### Service Layer Pattern

```typescript
// API Service Structure
api/
├── apiSlice.ts        # RTK Query base configuration
├── apiUtils.ts        # HTTP utilities and interceptors
└── services/
    ├── auth.ts        # Authentication endpoints
    └── images.ts      # Image management endpoints
```

### API Service Design

#### 1. Centralized Configuration
```typescript
// apiSlice.ts
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add authentication headers
      return headers;
    },
  }),
  tagTypes: ['Images', 'User'],
  endpoints: () => ({}),
});
```

#### 2. Feature-Based Endpoints
```typescript
// services/images.ts
export const imageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<PaginatedImagesResponse, ImageQueryParams>({
      query: (params) => ({
        url: '/images',
        params,
      }),
      providesTags: ['Images'],
    }),
    uploadImages: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/images/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Images'],
    }),
  }),
});
```

#### 3. Automatic Hook Generation
RTK Query automatically generates hooks:
- `useGetImagesQuery`
- `useUploadImagesMutation`

### Error Handling Strategy

#### 1. API Level Error Handling
```typescript
// Global error handling in apiSlice
baseQuery: async (args, api, extraOptions) => {
  const result = await fetchBaseQuery(args, api, extraOptions);
  
  if (result.error) {
    // Handle different error types
    if (result.error.status === 401) {
      // Redirect to login
    }
  }
  
  return result;
};
```

#### 2. Component Level Error Handling
```typescript
const { data, error, isLoading } = useGetImagesQuery(params);

if (error) {
  return <ErrorBoundary error={error} />;
}
```

---

## Routing Architecture

### React Router v7 Setup

```typescript
// Nested routing structure
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />, // Route guard
        children: [
          {
            path: "/",
            element: <AppLayout />,
            children: [
              { index: true, element: <GalleryPage /> }
            ]
          }
        ]
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: '*', element: <CatchRedirect /> }
    ]
  }
]);
```

### Route Protection Strategy

#### 1. Higher-Order Component Pattern
```typescript
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <PageSkeleton />;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
```

#### 2. Authentication Context
```typescript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data: profile, isLoading } = useGetProfileQuery();
  
  const contextValue = {
    user: profile?.data,
    isAuthenticated: !!profile?.data,
    isLoading,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Performance Architecture

### Code Splitting Strategy

#### 1. Route-Level Code Splitting
```typescript
// Lazy load page components
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));

// Wrap with Suspense
<Suspense fallback={<PageSkeleton />}>
  <GalleryPage />
</Suspense>
```

#### 2. Component-Level Code Splitting
```typescript
// Heavy components loaded on demand
const ImageEditor = lazy(() => import('./ImageEditor'));

// Conditional loading
{showEditor && (
  <Suspense fallback={<ComponentSkeleton />}>
    <ImageEditor />
  </Suspense>
)}
```

### Caching Strategy

#### 1. RTK Query Caching
```typescript
// Automatic caching with invalidation
{
  keepUnusedDataFor: 60, // Cache for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30s
}
```

#### 2. Browser Caching
- Static assets cached by Vite build
- Service worker for offline functionality (future)

### Image Loading Optimization

#### 1. Progressive Loading
```typescript
const ImageCard = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!isLoaded && <ImageSkeleton />}
      <img
        src={image.secureUrl}
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
        loading="lazy" // Native lazy loading
      />
    </div>
  );
};
```

#### 2. Responsive Images
```typescript
// Cloudinary URL transformations
const getOptimizedImageUrl = (url: string, width: number) => {
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
};
```

---

## Responsive Design Architecture

### Mobile-First Approach

#### 1. Tailwind Breakpoints
```typescript
// Component responsive design
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-5 
  gap-4
">
```

#### 2. Dynamic Column Calculation
```typescript
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(1);
  
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(5);
      else if (width >= 1024) setColumns(4);
      else if (width >= 768) setColumns(3);
      else if (width >= 640) setColumns(2);
      else setColumns(1);
    };
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);
  
  return columns;
};
```

### Touch and Gesture Support

#### 1. Touch-Friendly Components
```typescript
// Large touch targets for mobile
<Button className="min-h-12 min-w-12 p-3">
  <Icon size={20} />
</Button>
```

#### 2. Gesture Handling (Future Enhancement)
- Swipe navigation for image galleries
- Pinch-to-zoom for image details
- Pull-to-refresh for content updates

---

## Security Architecture

### Client-Side Security Measures

#### 1. Authentication Token Handling
```typescript
// Secure cookie storage (HTTP-only)
const handleLogin = async (credentials) => {
  const { data } = await loginMutation(credentials);
  // Token stored in HTTP-only cookie by backend
  // No JavaScript access to token
};
```

#### 2. Input Validation
```typescript
// Client-side validation with Yup
const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// React Hook Form integration
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(validationSchema)
});
```

#### 3. XSS Prevention
- All user inputs sanitized
- Content Security Policy headers (backend)
- Trusted types for DOM manipulation

### Route Security

#### 1. Protected Route Guards
```typescript
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

#### 2. Automatic Logout on Token Expiry
```typescript
// API interceptor for 401 responses
baseQuery: async (args, api, extraOptions) => {
  const result = await fetchBaseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    // Clear auth state and redirect
    api.dispatch(logout());
    window.location.href = '/login';
  }
  
  return result;
};
```

---

## Testing Architecture (Future Enhancement)

### Testing Strategy

#### 1. Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { ImageCard } from './ImageCard';

test('renders image card with metadata', () => {
  const mockImage = {
    id: '1',
    secureUrl: 'https://example.com/image.jpg',
    metadata: { tags: ['nature', 'landscape'] }
  };
  
  render(<ImageCard image={mockImage} />);
  
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByText('nature')).toBeInTheDocument();
});
```

#### 2. Integration Testing
```typescript
// API integration testing
import { renderHook } from '@testing-library/react';
import { useGetImagesQuery } from '../api/services/images';

test('fetches images successfully', async () => {
  const { result } = renderHook(() => useGetImagesQuery({ page: 1, limit: 12 }));
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

#### 3. End-to-End Testing (Planned)
- Playwright for full user journey testing
- Authentication flow testing
- Image upload and search testing

---

## Build & Deployment Architecture

### Vite Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd'],
          state: ['@reduxjs/toolkit']
        }
      }
    }
  }
});
```

### Deployment Strategies

#### 1. Static Site Deployment
**Recommended for**: Development, staging, and production
**Platforms**: Vercel, Netlify, GitHub Pages

#### 2. CDN Deployment
**Recommended for**: Production with high traffic
**Platforms**: AWS CloudFront, Google Cloud CDN

#### 3. Container Deployment
```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## Monitoring & Analytics Architecture

### Performance Monitoring (Future)

#### 1. Core Web Vitals
```typescript
// Web Vitals measurement
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### 2. Error Boundary Implementation
```typescript
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

---

## Future Enhancements

### Phase 1: Core Improvements
- [ ] Progressive Web App (PWA) capabilities
- [ ] Enhanced error boundaries and error handling
- [ ] Comprehensive testing suite
- [ ] Performance monitoring integration

### Phase 2: Advanced Features
- [ ] Real-time notifications with WebSocket
- [ ] Advanced image editing capabilities
- [ ] Batch operations for multiple images
- [ ] Advanced search with faceted filtering

### Phase 3: Platform Features
- [ ] Offline functionality with service workers
- [ ] Push notifications
- [ ] Social sharing integration
- [ ] Advanced analytics and user insights

---

## Conclusion

This frontend architecture provides a solid foundation for a modern, scalable image gallery application. The combination of React 19, TypeScript, Vite, and Redux Toolkit Query creates a performant and maintainable codebase that can evolve with changing requirements.

Key architectural strengths:
- **Type Safety**: Full TypeScript coverage reduces bugs
- **Performance**: Optimized loading and caching strategies
- **Maintainability**: Clear separation of concerns and reusable components
- **User Experience**: Responsive design and intuitive interactions
- **Scalability**: Modular architecture supports feature growth

The architecture is designed to support both current requirements and future enhancements while maintaining code quality and developer productivity.
