# 🎨 Image Gallery - Frontend Application

<p align="center">
  <a href="https://react.dev/" target="blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="60" alt="React" /></a>
  <span style="margin: 0 20px; font-size: 24px;">+</span>
  <a href="https://www.typescriptlang.org/" target="blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="60" alt="TypeScript" /></a>
  <span style="margin: 0 20px; font-size: 24px;">+</span>
  <a href="https://vitejs.dev/" target="blank"><img src="https://vitejs.dev/logo.svg" width="60" alt="Vite" /></a>
  <span style="margin: 0 20px; font-size: 24px;">+</span>
  <a href="https://ant.design/" target="blank"><img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" width="60" alt="Ant Design" /></a>
</p>

<p align="center">
  A modern, responsive frontend for the AI-powered Image Gallery system. Built with React 19, TypeScript, Vite, and Ant Design for a seamless user experience.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-components">Components</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

## 🌟 Features

- **🔐 Secure Authentication**: JWT-based login/signup with persistent sessions
- **🖼️ Image Management**: Drag-and-drop upload with real-time preview
- **🤖 AI-Powered Search**: Search by tags, colors, descriptions, and similarity
- **🎨 Smart Filtering**: Advanced filters with color-based image discovery
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **⚡ Performance Optimized**: React 19 with Vite for lightning-fast development
- **🎭 Modern UI/UX**: Ant Design components with custom styling
- **🔄 State Management**: Redux Toolkit Query for efficient data fetching
- **📊 Real-time Updates**: Automatic refetching and cache invalidation

## 📋 Description

The frontend application provides an intuitive interface for the HIPAA Testing Image Gallery system. Users can securely upload images, view AI-generated analysis, and discover content through intelligent search and filtering capabilities.

## 🚀 Quick Start

1. **Prerequisites**
   ```bash
   Node.js (v18 or higher)
   npm or yarn package manager
   ```

2. **Install dependencies**
   ```bash
   cd imageGallery
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Make sure the backend API is running on `http://localhost:8000`

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[📖 SETUP.md](./SETUP.md)** | Complete setup and configuration guide |
| **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** | Frontend architecture and design decisions |
| **[🔗 INTEGRATION.md](./INTEGRATION.md)** | Backend-frontend integration guide |
| **[🧩 COMPONENTS.md](./COMPONENTS.md)** | Component library documentation |

## 🛠️ Tech Stack

### Core Technologies
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Framework
- **[Ant Design](https://ant.design/)** - Enterprise-class UI components
- **[Ant Design Icons](https://ant.design/components/icon/)** - Comprehensive icon library
- **Custom Components** - Tailored UI components for image gallery

### State Management
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - Modern Redux development
- **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** - Powerful data fetching
- **React Context** - Authentication state management

### Form Handling
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Yup](https://github.com/jquense/yup)** - Schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolver

### Additional Features
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing
- **[React Dropzone](https://react-dropzone.js.org/)** - File upload with drag-and-drop
- **[js-cookie](https://github.com/js-cookie/js-cookie)** - Cookie handling for authentication
- **[Axios](https://axios-http.com/)** - HTTP client for API calls

## 🧩 Key Components

### Core Components
```
src/components/
├── common/           # Reusable UI components
│   ├── Button/       # Custom button component
│   ├── ImageCard/    # Image display card
│   ├── ImageUpload/  # Drag-and-drop upload
│   └── layout/       # App layout components
├── gallery/          # Gallery-specific components
│   ├── GalleryList/  # Image grid display
│   ├── GalleryFilters/ # Search and filter controls
│   └── GalleryStatusBanner/ # Status messages
└── formElements/     # Form-related components
```

### Pages
- **LoginPage** - User authentication
- **SignupPage** - User registration  
- **GalleryPage** - Main image gallery interface

### Hooks
- **useAuth** - Authentication state management
- **useGalleryState** - Gallery state and actions

## 🔌 API Integration

### Authentication Endpoints
```typescript
POST /api/auth/login     // User login
POST /api/user/register  // User registration
GET  /api/user/profile   // Get user profile
```

### Image Management
```typescript
GET  /api/images         // Fetch images with filters
POST /api/images/upload  // Upload multiple images
```

### Query Parameters
```typescript
interface ImageQueryParams {
  page: number;          // Pagination
  limit: number;         // Items per page
  color?: string;        // Color filter
  search?: string;       // Text search
  similarTo?: string;    // Similar image ID
}
```

## 🧪 Development Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🏗️ Project Structure

```
imageGallery/
├── public/              # Static assets
├── src/
│   ├── api/            # API layer
│   │   ├── services/   # API service definitions
│   │   ├── apiSlice.ts # RTK Query setup
│   │   └── apiUtils.ts # HTTP utilities
│   ├── components/     # React components
│   │   ├── common/     # Reusable components
│   │   ├── core/       # Auth components
│   │   ├── formElements/ # Form components
│   │   └── gallery/    # Gallery components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── providers/      # Context providers
│   ├── router/         # Routing configuration
│   ├── store/          # Redux store
│   ├── utils/          # Utility functions
│   └── assets/         # Static assets
├── dist/               # Production build
└── docs/               # Documentation
```

## 🎨 UI/UX Features

### Image Gallery
- **Grid Layout**: Responsive masonry-style image grid
- **Lazy Loading**: Optimized image loading with skeletons
- **Modal Views**: Full-screen image details with metadata
- **Drag & Drop**: Intuitive file upload interface

### Search & Filtering
```typescript
// Advanced search capabilities
- Text search in tags and descriptions
- Color-based filtering (blue, red, green, etc.)
- Similar image discovery
- Combined filter conditions
- Real-time search results
```

## 📱 Responsive Design

### Mobile Optimization
- **Touch Gestures**: Swipe navigation and pinch-to-zoom
- **Mobile Menu**: Collapsible navigation for small screens
- **Optimized Images**: Responsive image loading
- **Fast Loading**: Optimized bundle size for mobile networks

### Desktop Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Multi-selection**: Bulk operations on images (planned)
- **Advanced Filters**: Extended filter panel
- **Drag & Drop**: Desktop file upload experience

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based**: Lazy load page components
- **Component-based**: Dynamic imports for heavy components
- **Bundle Analysis**: Optimized chunk sizes

### Caching Strategy
- **RTK Query**: Automatic API response caching
- **Browser Caching**: Static asset caching
- **Image Optimization**: Progressive loading with placeholders

## 🔐 Authentication Flow

1. **User Registration/Login**: Forms with validation
2. **Token Storage**: Secure cookie-based JWT storage
3. **Protected Routes**: Route guards for authenticated content
4. **Auto-logout**: Token expiration handling
5. **Persistent Sessions**: Remember user across browser sessions

## 🌍 Environment Configuration

```bash
# Create .env.local file (not tracked by git)
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📈 Development Roadmap

### Phase 1 (Current)
- ✅ Core image gallery functionality
- ✅ Authentication and user management
- ✅ AI-powered search and filtering
- ✅ Responsive design

### Phase 2 (Upcoming)
- 🔄 Real-time notifications
- 🔄 Batch image operations
- 🔄 Advanced image editor
- 🔄 Social sharing features

### Phase 3 (Future)
- 📋 Progressive Web App (PWA)
- 📋 Offline functionality
- 📋 Advanced animations
- 📋 Voice search integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

- 📖 Check the [SETUP.md](./SETUP.md) for detailed setup instructions
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the frontend design
- 🔗 Review [INTEGRATION.md](./INTEGRATION.md) for API integration details

**Additional Resources:**
- [React Documentation](https://react.dev/) - React 19 features and guides
- [Vite Documentation](https://vitejs.dev/guide/) - Build tool configuration
- [Ant Design](https://ant.design/docs/react/introduce) - UI component library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management guide

---

<p align="center">
  Built with ❤️ for modern image gallery experiences
</p>