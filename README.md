# Rooeel Frontend

A modern, responsive frontend application for the Rooeel Backend API, built with React, TypeScript, and cutting-edge web technologies.

## 🚀 Features

- **Modern UI/UX**: Beautiful, premium design with glassmorphism effects, gradients, and smooth animations
- **Type-Safe**: Full TypeScript support with strict type checking
- **State Management**: Zustand for global state, TanStack Query for server state
- **Form Validation**: React Hook Form with Zod schema validation
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Dark Mode**: Built-in dark mode support with light mode option
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Performance**: Code splitting, lazy loading, and optimized bundle size

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Rooeel Backend API running (default: `http://localhost:3000`)

## 🛠️ Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Header, AppLayout)
│   ├── auth/           # Authentication components (ProtectedRoute)
│   └── admin/          # Admin-specific components
├── pages/              # Page components
│   ├── admin/          # Admin management pages
│   ├── LoginPage.tsx   # Login page
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── services/           # API services
│   ├── api.client.ts   # Axios instance with interceptors
│   ├── admin.service.ts
│   └── auth.service.ts
├── stores/             # Zustand stores
│   └── auth.store.ts   # Authentication state
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useAdmins.ts    # Admin CRUD hooks
├── types/              # TypeScript type definitions
│   ├── api.types.ts
│   └── auth.types.ts
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   ├── validation.ts   # Zod schemas
│   └── format.ts       # Formatting utilities
├── config/             # Configuration
│   └── constants.ts    # App constants
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and design tokens
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **CSS Variables**: Centralized design tokens for colors, spacing, typography, and more
- **Modern Typography**: Inter font family with responsive sizing
- **Color Palette**: HSL-based colors for easy manipulation and theming
- **Spacing Scale**: Consistent spacing using a modular scale
- **Shadows & Effects**: Layered shadows and glassmorphism effects
- **Animations**: Smooth transitions and micro-interactions

## 🔐 Authentication

The application uses a simulated authentication system:

1. Navigate to `/login`
2. Enter any admin email from the backend (password validation is simulated)
3. Upon successful login, you'll be redirected to the dashboard
4. Protected routes require authentication

**Note**: Since the backend doesn't have dedicated auth endpoints, the login simulates authentication by fetching admin data and creating a mock JWT token.

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Login page | Public |
| `/dashboard` | Dashboard home | Protected |
| `/admin` | Admin list | Protected |
| `/admin/new` | Create new admin | Protected |
| `/admin/:id/edit` | Edit admin (planned) | Protected |

## 🧩 Key Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Global state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 🎯 API Integration

The frontend integrates with the Rooeel Backend API:

### Admin Endpoints
- `GET /admin` - Fetch all admins
- `GET /admin/:id` - Fetch single admin
- `POST /admin` - Create new admin
- `PATCH /admin/:id` - Update admin
- `DELETE /admin/:id` - Delete admin

### Request/Response Handling
- Automatic token injection via Axios interceptors
- Error handling with user-friendly messages
- Loading states for all async operations
- Optimistic updates with cache invalidation

## 🧪 Development

### Code Quality
```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Best Practices
- Component-based architecture with single responsibility
- Custom hooks for reusable logic
- Type-safe API calls
- Proper error boundaries
- Accessibility-first approach

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Configure environment variables** on your hosting platform

## 🔧 Troubleshooting

### API Connection Issues
- Ensure the backend is running at the configured `VITE_API_BASE_URL`
- Check CORS configuration on the backend
- Verify network requests in browser DevTools

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 License

This project is part of the Rooeel application suite.

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
