# Frontend-Specific Principles

**Separation of Concerns (SoC)**: Frontend code is divided into distinct layers or components that address specific functions such as presentation, business logic, and data management. This enhances code readability and testability.

**Single Responsibility Principle (SRP)**: Each frontend component or module should have one clear responsibility, such as rendering UI elements or managing state, making code easier to maintain and test.

**User Experience Focus**: Emphasis is placed on responsiveness, accessibility, fast loading times, and smooth interactions to ensure an inclusive and efficient UI.

**Modularity and Reusability**: Creating small, reusable, well-encapsulated components is a cornerstone of modern frontend architecture.

**Maintainability and Consistency**: Code should follow consistent structure and style, enhancing readability and long-term maintenance.

# NestJS Application

A NestJS application with Authentication, Admin, and User modules.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory (see `.env.example` for reference):

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/rooeel?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"
```

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (if using a database)
npx prisma migrate dev
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Build

```bash
npm run build
```

## Modules

- **AuthModule**: Authentication module with JWT-based authentication
  - Register, login, and logout endpoints
  - Password hashing with bcrypt
  - JWT token generation and validation
  - Token blacklist for logout functionality

- **UserModule**: User management module
  - Protected user endpoints requiring authentication

- **ProjectModule**: Project management module
  - Protected CRUD endpoints for projects

- **AdminModule**: Admin functionality module
  - Controller: `/admin` endpoint
  - Service: AdminService with basic functionality

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
  - Returns: User object (without password)

- `POST /auth/login` - Login with email and password
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "accessToken": "jwt-token", "user": { ... } }`

- `POST /auth/logout` - Logout and invalidate the current JWT token (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "message": "Logged out successfully" }`

### User (Protected - Requires JWT Token)

- `GET /user` - Get all users
  - Headers: `Authorization: Bearer <token>`
  
- `GET /user/profile` - Get current user profile
  - Headers: `Authorization: Bearer <token>`
  
- `GET /user/:id` - Get user by ID
  - Headers: `Authorization: Bearer <token>`

### Project (Protected - Requires JWT Token)

- `POST /project` - Create a project
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "My Project", "description": "Optional" }`

- `GET /project` - List your projects
  - Headers: `Authorization: Bearer <token>`

- `GET /project/:id` - Get a project by ID (must be owner)
  - Headers: `Authorization: Bearer <token>`

- `PATCH /project/:id` - Update a project (must be owner)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "New Name", "description": "Optional" }`

- `DELETE /project/:id` - Delete a project (must be owner)
  - Headers: `Authorization: Bearer <token>`

### Admin

- `GET /admin` - Returns admin information
