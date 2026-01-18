# Print Flow - Claude Context

## Project Overview

Print Flow is a 3D print queue management system built with a modern monorepo architecture. It allows users to submit 3D print requests, track their status, and enables administrators to approve and manage the print queue.

**Tech Stack:**
- **Runtime:** Bun (v1.3.0+)
- **Monorepo:** Bun workspaces
- **Backend:** Bun server with SQLite database
- **Frontend:** React 19 with React Router 7, TanStack Query, Tailwind CSS 4
- **Authentication:** SuperTokens (Google OAuth)
- **Code Quality:** Biome (formatting & linting)

**Architecture:**
- Monorepo with 4 workspace packages: `auth`, `backend`, `frontend`, `shared`
- RESTful API design
- Role-based access control (RBAC)
- Shared TypeScript types and validation schemas

## Developer Personas

### frodes (Frontend Developer/Designer)

**Role:** Visual design and UI component implementation

**Scope:**
- ✅ `frontend/` - All frontend code
- ✅ `shared/browser/` - Shared types and schemas
- ❌ `backend/` - No backend work
- ❌ `auth/` - No auth service work

**Responsibilities:**
- Design and implement React components with focus on visual presentation
- Style components using Tailwind CSS and shadcn/ui
- Ensure mobile-first responsive design (app is primarily used on phones)
- Create intuitive, accessible user interfaces
- Leave business logic implementation to backend developers

**Guidelines:**
1. **Mobile-First Design**
   - Always design for mobile screens first (the app is primarily used on phones)
   - Use responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
   - Test touch interactions and tap targets (minimum 44x44px)
   - Consider thumb-friendly navigation zones
   - Use appropriate text sizes for mobile readability

2. **Component Development**
   - Use shadcn/ui components when possible (see installation below)
   - Create reusable components in `frontend/src/components/`
   - Use the `cn()` utility from `@/lib/utils` for conditional classes
   - Import from `@/components/ui/` for shadcn components

3. **Logic Placeholders**
   - Leave event handlers empty or with TODO comments:
     ```typescript
     <Button onClick={() => {
       // TODO: Implement print approval logic
     }}>
       Approve Print
     </Button>
     ```
   - Focus on the visual structure, let others implement the logic

4. **Type Safety**
   - Use types from `shared/browser/` for props and data structures
   - Create new shared types when needed for component props

### Installing shadcn/ui Components

The project is already configured for shadcn/ui with the "new-york" style.

**Add a new component:**
```bash
cd frontend
bunx shadcn@latest add button
```

**Add multiple components:**
```bash
bunx shadcn@latest add card dialog sheet
```

**Already Installed Components:**
All components are installed to `/frontend/src/components/ui`

**Component Configuration:**
- **Style:** new-york
- **Base Color:** neutral
- **CSS Variables:** enabled
- **Icon Library:** lucide-react
- **Path Aliases:** `@/components`, `@/lib`, `@/hooks`

**Usage Example:**
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrintCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>3D Print Request</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => {/* TODO: Implement */}}>
          Submit Request
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Mobile-Optimized Components:**
Consider using these shadcn components for mobile:
- `sheet` - Better than dialog for mobile (slides up from bottom)
- `drawer` - Mobile-friendly navigation drawer
- `tabs` - Good for mobile navigation
- `accordion` - Space-efficient content display

## Project Structure

```
print-flow/
├── auth/              # Authentication service (SuperTokens)
├── backend/           # API server (Bun)
│   ├── migrations/    # SQLite database migrations
│   ├── src/
│   │   ├── print-queue/    # Print queue business logic
│   │   ├── security/       # Auth middleware
│   │   ├── user/           # User management
│   │   └── utils/          # Shared utilities
│   └── index.ts       # Server entry point
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route pages
│   │   └── utils/          # Frontend utilities
│   └── index.html     # HTML entry point
├── shared/            # Shared code between backend/frontend
│   ├── browser/       # Browser-compatible shared code
│   │   ├── printQueueItem.ts  # Print queue types & schemas
│   │   └── user.ts           # User types & schemas
│   └── node/          # Node-specific shared code
└── package.json       # Root package.json with workspace config
```

## Key Components

### Backend API (`backend/`)

**Server:** Bun native HTTP server with route-based handlers

**Database:** SQLite with `bun-sqlite-migrations`
- Tables: `print_queue`, `material`, `user` (likely)
- UUIDs: Using UUIDv7 for chronological ordering

**Authentication:**
- JWT verification via JWKS
- `withAuthentication` middleware wrapper
- Auth override mode for development (`ALLOW_AUTH_OVERRIDE=true`)

**Key Features:**
- Automatic image URL scraping from model links (using Cheerio)
- Transaction-based inserts for print requests with materials
- Permission-based access control (read, request_print, approve_print)

### Frontend (`frontend/`)

**Framework:** React 19 with modern patterns
- **Routing:** React Router 7
- **State Management:** TanStack Query for server state
- **Styling:** Tailwind CSS 4 with Radix UI components
- **Forms:** React Hook Form with Zod validation
- **Theme:** Dark/light mode support (next-themes)

**Key Libraries:**
- `supertokens-auth-react` - Auth UI & session management
- `ky` - HTTP client
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `react-use` - Utility hooks

**Development:**
- Custom dev server (`dev-server.ts`)
- Custom bundler (`bundle.ts`) using Bun's native bundler
- Auth override mode for development (`FRONTEND_OVERRIDE_AUTH=true`)

### Auth Service (`auth/`)

**Framework:** Express + SuperTokens
- Handles OAuth flows (Google)
- Issues JWTs
- Provides JWKS endpoint for backend verification
- CORS-enabled for frontend communication

### Shared Code (`shared/`)

**Browser Package:**
- `printQueueItem.ts` - Print queue types, schemas, DTOs
- `user.ts` - User types and update schemas
- Shared between frontend and backend for type safety

**Node Package:** (Node-specific utilities)

## Development Workflow

### Setup
```bash
# Copy environment files
cp backend/example.env backend/.env
cp frontend/example.env frontend/.env
cp auth/example.env auth/.env

# Install dependencies
bun install
```

### Running the App

**Full stack (frontend + backend):**
```bash
bun dev
```

**With authentication service:**
```bash
bun dev:auth
```

**Individual services:**
```bash
bun run --filter backend dev
bun run --filter frontend dev
bun run --filter auth dev:auth
```

### Code Quality

```bash
bun format        # Format with Biome
bun lint          # Lint with Biome
bun lint:fix      # Auto-fix lint issues
bun tsc           # Type check all packages
```

## Environment Variables

### Backend (`.env`)
- `SUPERTOKENS_CONNECTION_URI` - SuperTokens core URL
- `SUPERTOKENS_API_KEY` - SuperTokens API key
- `JWKS_URI` - JWKS endpoint for JWT verification
- `ALLOW_AUTH_OVERRIDE` - Enable mock auth in dev (true/false)
- `PORT` - Server port (default: 3001)

### Frontend (`.env`)
- `FRONTEND_OVERRIDE_AUTH` - Enable mock auth in dev (true/false)

### Auth (`.env`)
- `SUPERTOKENS_CONNECTION_URI` - SuperTokens core URL
- `SUPERTOKENS_API_KEY` - SuperTokens API key
- `API_DOMAIN` - Backend API URL
- `WEBSITE_DOMAIN` - Frontend URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### User
- UUID-based identification
- Role-based permissions
- SuperTokens integration for OAuth

## Key Patterns

### Middleware Pattern
The backend uses composable middleware:
```typescript
withLogging(withAuthentication(handler))
```

### Response Utilities
- `jsonResponseOr404()` - Wrap handlers that may return null
- `forbiddenResponse()` - 403 responses
- `notFoundResponse()` - 404 responses
- `internalServerErrorResponse()` - 500 responses

### Type Safety
- Shared Zod schemas for validation
- TypeScript types derived from schemas
- DTOs for API responses (e.g., replacing UUIDs with readable names)

### Database Access
- Prepared statements for performance
- Transaction support for multi-table operations
- Type-safe query results

## Deployment

**Production:** Docker Compose setup (`docker-compose.prod.yml`)

Each service has:
- `.dockerignore` file
- `Dockerfile`
- Service-specific builds

## Development Notes

### Auth Override Mode
In development, you can bypass the auth service:
- Set `ALLOW_AUTH_OVERRIDE=true` in backend
- Set `FRONTEND_OVERRIDE_AUTH=true` in frontend
- Allows rapid development without OAuth setup

### Database Migrations
- Located in `backend/migrations/`
- Managed by `bun-sqlite-migrations`
- SQLite database at `backend/print-flow.sqlite`

### Type Checking
Each package has its own `tsconfig.json` extending `tsconfig.base.json`
The backend has a custom `tsc` script that filters out migration library errors.

### Git Hooks
Husky is configured for pre-commit hooks (likely for linting/formatting)

## Common Tasks for frodes (Frontend Developers)

### Creating a New Component
1. Create component file in `frontend/src/components/`
   ```bash
   # Example: Create a new print status badge
   touch frontend/src/components/PrintStatusBadge.tsx
   ```

2. Use shadcn components as building blocks:
   ```typescript
   import { Badge } from "@/components/ui/badge";
   import type { PrintStatus } from "shared/browser";
   
   export function PrintStatusBadge({ status }: { status: PrintStatus }) {
     return (
       <Badge 
         variant={status === "approved" ? "default" : "secondary"}
         className="capitalize"
       >
         {status}
       </Badge>
     );
   }
   ```

3. Add to page component in `frontend/src/pages/`

### Styling Best Practices

**Mobile-First Classes:**
```typescript
<div className="
  flex flex-col gap-4        // Mobile: vertical stack
  md:flex-row md:gap-6       // Tablet+: horizontal layout
">
  {/* Content */}
</div>
```

**Touch-Friendly Buttons:**
```typescript
<Button className="
  min-h-[44px] min-w-[44px]  // Minimum touch target
  px-6 py-3                   // Generous padding
  text-base                   // Readable text size
">
  Tap Me
</Button>
```

**Responsive Typography:**
```typescript
<h1 className="
  text-2xl font-bold         // Mobile
  md:text-3xl                // Tablet
  lg:text-4xl                // Desktop
">
  Print Flow
</h1>
```

### Working with Shared Types

Import types from the shared package:
```typescript
import type { PrintQueueItemTypeDto, PrintStatus } from "shared/browser";

interface PrintCardProps {
  item: PrintQueueItemTypeDto;
}

export function PrintCard({ item }: PrintCardProps) {
  // Component implementation
}
```

### Creating Mobile-Optimized Layouts

**Bottom Sheet for Actions:**
```typescript
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>View Details</Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-[80vh]">
    {/* Mobile-friendly content */}
  </SheetContent>
</Sheet>
```

**Sticky Bottom Action Bar:**
```typescript
<div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
  <Button className="w-full" onClick={() => {/* TODO */}}>
    Submit Request
  </Button>
</div>
```

## Common Tasks (Backend/Fullstack)

### Adding a New API Endpoint
1. Add route in `backend/index.ts`
2. Wrap with `withLogging(withAuthentication())`
3. Add handler in appropriate service file
4. Add types/schemas in `shared/browser/` if needed

### Adding a New Frontend Page
1. Create page component in `frontend/src/pages/`
2. Add route in routing configuration
3. Use TanStack Query for data fetching
4. Share types from `shared/browser/`

### Updating Permissions
Permissions are checked in route handlers via `authDetails.permissions.has()`
Available permissions: `read`, `request_print`, `approve_print`

## Troubleshooting

### TypeScript Errors
- Run `bun tsc` to check all packages
- Each workspace has independent TypeScript config
- Check `globals.d.ts` for global type definitions

### Auth Issues
- Verify SuperTokens is running (if not using override mode)
- Check JWKS_URI is accessible
- Ensure environment variables are set correctly

### Database Issues
- Check migrations have run
- SQLite file is at `backend/print-flow.sqlite`
- Data directory: `backend/.data/`
