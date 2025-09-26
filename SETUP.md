# Frontend Setup Instructions

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Recommended Tools
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
- **Chrome/Firefox DevTools**: React Developer Tools extension

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd imageGallery
```

### 2. Install Dependencies
```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Development Settings
VITE_NODE_ENV=development

# Optional: Enable source maps in development
VITE_BUILD_SOURCEMAP=true
```

**Environment Variables Explained:**
- `VITE_API_BASE_URL`: Backend API endpoint (must match your backend server)
- `VITE_NODE_ENV`: Application environment
- `VITE_BUILD_SOURCEMAP`: Enable source maps for debugging

### 4. Backend Dependency

**Important**: The frontend requires the backend API to be running. Ensure you have:

1. **Backend Server Running**: Start your NestJS backend on `http://localhost:8000`
2. **CORS Configured**: Backend should allow `http://localhost:5173` origin
3. **API Endpoints Available**: Authentication and image management endpoints

## Development Server

### Start Development Mode
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.1.7  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Access the Application
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000/api` (must be running)

## Build & Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Build Output
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js # Main JavaScript bundle
│   ├── index-[hash].css # Compiled styles
│   └── [assets]        # Other static assets
└── vite.svg           # Favicon
```

### Build Optimization Features
- **Code Splitting**: Automatic route-based and component-based splitting
- **Tree Shaking**: Remove unused code
- **Minification**: JavaScript and CSS compression
- **Asset Optimization**: Image and font optimization
- **Modern Browser Support**: ES2020+ with legacy fallbacks

## Development Commands

### Available Scripts
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint for code quality
npm run lint

# Type checking (if configured)
npm run type-check
```

### Development Workflow
1. **Start Backend**: Ensure NestJS backend is running
2. **Start Frontend**: Run `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Development**: Hot reload is enabled for instant feedback

## Project Structure Explained

```
imageGallery/
├── public/                 # Static assets
│   ├── vite.svg           # Favicon
│   └── ...                # Other public assets
├── src/                   # Source code
│   ├── api/               # API layer
│   │   ├── services/      # RTK Query services
│   │   │   ├── auth.ts    # Authentication API
│   │   │   └── images.ts  # Image management API
│   │   ├── apiSlice.ts    # RTK Query base
│   │   └── apiUtils.ts    # HTTP utilities
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   │   ├── Button/    # Custom button
│   │   │   ├── ImageCard/ # Image display
│   │   │   ├── ImageUpload/ # File upload
│   │   │   └── layout/    # App layout
│   │   ├── core/          # Authentication components
│   │   │   ├── Login/     # Login form
│   │   │   └── Signup/    # Registration form
│   │   ├── formElements/  # Form components
│   │   └── gallery/       # Gallery components
│   │       ├── GalleryList/ # Image grid
│   │       └── GalleryFilters/ # Search/filters
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook
│   │   └── useGalleryState.ts # Gallery state hook
│   ├── pages/             # Page components
│   │   ├── GalleryPage.tsx # Main gallery
│   │   ├── LoginPage.tsx  # Login page
│   │   └── SignupPage.tsx # Registration page
│   ├── providers/         # Context providers
│   ├── router/            # React Router config
│   ├── store/             # Redux store
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── dist/                  # Production build output
├── node_modules/          # Dependencies
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── eslint.config.js       # ESLint configuration
```

## Configuration Files

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## API Integration Setup

### Backend Connection
The frontend connects to your NestJS backend through:

1. **Base URL**: Configured in `VITE_API_BASE_URL` environment variable
2. **HTTP Client**: Axios with interceptors for authentication
3. **State Management**: RTK Query for API calls and caching

### Authentication Flow
1. **Login/Register**: User credentials sent to backend
2. **Token Storage**: JWT stored in HTTP-only cookies
3. **API Calls**: Token automatically included in requests
4. **Route Protection**: Protected routes require authentication

### API Endpoints Used
```typescript
// Authentication
POST /api/auth/login
POST /api/user/register
GET  /api/user/profile

// Image Management  
GET  /api/images
POST /api/images/upload
```

## Troubleshooting

### Common Issues

#### 1. Backend Connection Failed
**Symptom**: API calls return CORS or 404 errors
**Solutions**:
- Verify backend is running on `http://localhost:8000`
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure backend CORS allows `http://localhost:5173`

#### 2. Authentication Issues
**Symptom**: Login successful but redirects to login page
**Solutions**:
- Check browser cookies for JWT token
- Verify backend JWT configuration
- Check protected route implementation

#### 3. Image Upload Fails
**Symptom**: Images don't upload or return errors
**Solutions**:
- Verify backend upload endpoint is working
- Check file size limits in backend
- Ensure proper Content-Type headers

#### 4. Styling Issues
**Symptom**: Components look unstyled or broken
**Solutions**:
- Verify Tailwind CSS is properly configured
- Check for CSS import errors
- Ensure Ant Design styles are loaded

#### 5. Build Errors
**Symptom**: Production build fails
**Solutions**:
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correctly typed
- Check for unused variables/imports

### Performance Issues

#### Slow Development Server
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart development server
npm run dev
```

#### Large Bundle Size
```bash
# Analyze bundle size
npm run build
npx vite preview --mode analyze
```

### Environment-Specific Issues

#### Development Environment
- Hot reload not working: Restart dev server
- Module resolution errors: Clear `node_modules` and reinstall

#### Production Environment
- White screen: Check browser console for errors
- API calls failing: Verify production API URL

## IDE Setup

### VS Code Configuration (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- ESLint
- Prettier

## Testing Setup (Future Enhancement)

### Testing Framework Setup
```bash
# Install testing dependencies (when ready)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Test Configuration
```javascript
// vitest.config.ts (future)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## Deployment Options

### Static Hosting (Recommended)
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Git-based deployment with form handling
- **GitHub Pages**: Free hosting for public repositories

### CDN Deployment
- **AWS CloudFront + S3**: Enterprise-scale deployment
- **Google Cloud Storage**: Google's CDN solution
- **Azure Static Web Apps**: Microsoft's hosting solution

### Docker Deployment
```dockerfile
# Dockerfile (example)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Next Steps

1. **Complete Setup**: Follow all installation steps
2. **Start Development**: Run dev server and test basic functionality
3. **Review Components**: Explore the component library
4. **API Integration**: Test backend connectivity
5. **Customize**: Adapt components and styling to your needs

## Support

If you encounter issues:
1. Check this setup guide for solutions
2. Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Check the browser console for error messages
4. Verify backend API is accessible and returning expected responses
