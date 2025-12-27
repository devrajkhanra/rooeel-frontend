# Rooeel Frontend

A modern, clean frontend application for the Rooeel Backend API, built with React, TypeScript, and designed with Supabase's aesthetic in mind.

## 🎨 Design Philosophy

This application features a **Supabase-inspired design system** with:

- **Supabase Green** (#3ecf8e) as the primary accent color
- **Dark-first theme** with subtle backgrounds and minimal shadows
- **Inter font family** for clean, readable typography
- **Icon-only sidebar** (64px) for maximum content space
- **Minimal borders** and depth through color contrast
- **Clean, developer-focused aesthetic**

## 🚀 Features

- **Modern UI/UX**: Clean, minimal design inspired by Supabase
- **Type-Safe**: Full TypeScript support with strict type checking
- **State Management**: TanStack Query for server state management
- **Form Validation**: React Hook Form with Zod schema validation
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Dark Mode**: Built-in dark mode with optional light mode support
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Code splitting, lazy loading, and optimized bundle size

- **Request Management**: User change requests with admin approval workflow

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Rooeel Backend API running (default: `http://localhost:5000`)

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
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
│   ├── ui/             # Base UI components (Button, Input, Card, Badge, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, AppLayout)
│   ├── auth/           # Authentication components (ProtectedRoute)
│   ├── admin/          # Admin-specific components
│   ├── user/           # User-specific components
│   ├── project/        # Project management components

│   ├── admin/          # Admin management pages
│   ├── user/           # User management pages
│   ├── LoginPage.tsx   # Login page
│   ├── SignupPage.tsx  # Admin signup page
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── services/           # API services
│   ├── api.client.ts   # Axios instance with interceptors
│   ├── auth.service.ts # Authentication service
│   ├── admin.service.ts # Admin CRUD service
│   ├── user.service.ts # User CRUD service
│   ├── project.service.ts # Project management service

│   └── request.service.ts # Request management service
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useAdmins.ts    # Admin CRUD hooks
│   ├── useUsers.ts     # User CRUD hooks
│   ├── useProjects.ts  # Project management hooks
│   ├── useRequests.ts  # Request management hooks
├── types/              # TypeScript type definitions
│   ├── api.types.ts    # API models (Admin, User, Project, Designation, etc.)
│   └── auth.types.ts   # Auth types
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   ├── validation.ts   # Zod schemas
│   ├── format.ts       # Formatting utilities
│   ├── logger.ts       # Client-side logger
│   └── toast.ts        # Toast notifications
├── config/             # Configuration
│   ├── constants.ts    # App constants and routes
│   └── validation.constants.ts # Validation rules
├── stores/             # State management
│   └── auth.store.ts   # Authentication store
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and design tokens
```

## 🎨 Design System

### Color Palette

- **Primary**: Supabase Green (#3ecf8e)
- **Backgrounds**: 
  - Main: #1c1c1c
  - Surface: #111111
  - Header: #000000
- **Borders**: #2e2e2e (subtle, 1px)
- **Text**: 
  - Primary: #ffffff
  - Secondary: #a1a1aa
  - Tertiary: #71717a

### Typography

- **Font Family**: Inter
- **Base Size**: 14px
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Grid System**: 4px/8px base units
- **Border Radius**: 6px-8px
- **Shadows**: Minimal (depth through color contrast)

## 🔐 Authentication

The application supports two types of authentication:

### Admin Authentication
1. Navigate to `/signup` to create an admin account
2. Or use `/login` to sign in with existing admin credentials
3. Admins can only be created through the signup process (not by other admins)

### User Authentication
1. Users **cannot self-register**
2. Admins create user accounts via the User Management page
3. Users can then login at `/login` with their credentials

**Authentication Flow:**
- JWT tokens stored in localStorage
- Automatic token injection via Axios interceptors
- Protected routes require valid authentication
- Role-based access control (admin/user)

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Login page (admin/user) | Public |
| `/signup` | Admin signup page | Public |
| `/dashboard` | Dashboard home | Protected |
| `/users` | User management | Protected (Admin) |
| `/projects` | Project management | Protected |

| `/requests` | My change requests | Protected (User) |
| `/admin-requests` | Manage user requests | Protected (Admin) |
| `/admin/:id/edit` | Edit admin profile | Protected (Admin) |

## 🧩 Key Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS

## 🎯 API Integration

The frontend integrates with the Rooeel Backend API running on `http://localhost:5000`:

### Authentication Endpoints

#### Admin Signup
```typescript
POST /auth/signup
Body: { firstName, lastName, email, password }
Response: { access_token, admin }
```

#### Admin Login
```typescript
POST /auth/login
Body: { email, password }
Response: { access_token }
```

#### User Login
```typescript
POST /auth/user/login
Body: { email, password }
Response: { access_token }
```

#### Logout
```typescript
POST /auth/logout (admin)
POST /auth/user/logout (user)
Response: { message }
```

### Admin Management Endpoints

```typescript
GET /admin              // Get all admins
GET /admin/:id          // Get admin by ID
PATCH /admin/:id        // Update admin
DELETE /admin/:id       // Delete admin
```

**Note**: Admins can only be created via `/auth/signup` endpoint

### User Management Endpoints

```typescript
POST /user              // Create user (admin only)
GET /user               // Get all users
GET /user/:id           // Get user by ID
PATCH /user/:id         // Update user
DELETE /user/:id        // Delete user
```

### Project Management Endpoints

```typescript
POST /project                           // Create project (admin only)
GET /project                            // Get all projects (filtered by role)
GET /project/:id                        // Get project by ID
PATCH /project/:id                      // Update project (admin only)
DELETE /project/:id                     // Delete project (admin only)
POST /project/:id/assign-user           // Assign user to project
POST /project/:id/assign-user           // Assign user to project
DELETE /project/:id/remove-user/:userId // Remove user from project
```



### Request Management Endpoints

```typescript
POST /request                   // Create change request (user only)
GET /request/my-requests        // Get my requests (user only)
GET /request/admin-requests     // Get admin requests (admin only)
GET /request/:id                // Get request by ID
PATCH /request/:id/approve      // Approve request (admin only)
PATCH /request/:id/reject       // Reject request (admin only)
```

### Request/Response Handling
- Automatic JWT token injection via Axios interceptors
- 401 error handling with automatic logout
- Loading states for all async operations
- Optimistic updates with cache invalidation
- Error handling with user-friendly messages

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
- Type-safe API calls with TypeScript
- Consistent design system usage
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

3. **Configure environment variables** on your hosting platform:
   ```
   VITE_API_BASE_URL=<your-backend-url>
   ```

## 🔧 Troubleshooting

### API Connection Issues
- Ensure the backend is running at the configured `VITE_API_BASE_URL`
- Check CORS configuration on the backend
- Verify network requests in browser DevTools

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Authentication Issues
- Check that JWT tokens are being stored in localStorage
- Verify the backend is returning proper token format
- Check browser console for authentication errors

## 📝 Features Overview

### Dashboard
- Welcome message with user's name
- Quick access cards for getting started
- Clean, minimal layout

### User Management (Admin Only)
- Create new users
- View all registered users
- Update user information
- Delete users
- Display user information (name, email, creation date)
- Active status badges

### Project Management
- Create and manage projects (admin)
- View assigned projects (user)
- Assign users to projects
- Set project status (active, inactive, completed)


### Request Management
- Users can request profile changes (firstName, lastName, email, password)
- Admins receive and review change requests
- Approve/reject requests
- Automatic profile updates on approval (except password)

### Admin Management
- Edit admin profile
- Update admin information
- Self-deletion prevention (admins cannot delete themselves)

### Authentication
- Secure login/signup forms
- Form validation with helpful error messages
- JWT-based authentication
- Role-based access control

## 🎨 UI Components

All components follow Supabase's design aesthetic:

- **Button**: Solid green primary, subtle borders for secondary
- **Card**: Minimal with 1px borders, no shadows
- **Input**: Green focus state, clean borders
- **Badge**: Color-coded status indicators (default, secondary, success, warning, danger, info)
- **Sidebar**: Icon-only navigation (64px width)
- **Header**: Minimal black header with user menu

## � Database Schema Integration

The frontend types align with the backend database schema:

### Admin
- `id`, `firstName`, `lastName`, `email`, `createdAt`
- Relations: Creates users, receives requests, owns projects

### User
- `id`, `firstName`, `lastName`, `email`, `createdBy`, `createdAt`
- Relations: Created by admin, can make requests, assigned to projects

### Project
- `id`, `name`, `description`, `status`, `createdBy`, `createdAt`, `updatedAt`
- Relations: Owned by admin, has assigned users, has designations



### ProjectUser (Join Table)
- `id`, `projectId`, `userId`, `assignedAt`
- Links users to projects

### UserRequest
- `id`, `userId`, `adminId`, `requestType`, `currentValue`, `requestedValue`, `status`, `createdAt`, `updatedAt`
- Tracks user change requests

## 🔄 State Management

### TanStack Query (React Query)
- Server state management
- Automatic caching and invalidation
- Optimistic updates
- Background refetching

### Query Keys Structure
```typescript
adminKeys: ['admins', 'list', { id }]
userKeys: ['users', 'list', { id }]
projectKeys: ['projects', 'list', { id }]

requestKeys: ['requests', 'my-requests', 'admin-requests', { id }]
```

## �📝 License

This project is part of the Rooeel application suite.

## 🤝 Contributing

1. Follow the existing code style and design system
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Maintain consistency with Supabase design aesthetic

---

## 🆕 Recent Updates

### Enhanced Components
- `ProjectCard`: Display user information clearly

### API Service Enhancements
- `projectService`: Added methods for user assignment
- `useProjects`: Added React Query hooks for project operations
