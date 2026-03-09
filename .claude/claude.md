# Print Flow - Claude Context

## Project Overview

Print Flow is a 3D print queue management system built with a modern monorepo architecture. It allows users to submit 3D print requests, track their status, and enables administrators to approve and manage the print queue.

**Tech Stack:**
- **Runtime:** Bun (v1.3.0+)
- **Monorepo:** Bun workspaces with 4 packages: `auth`, `backend`, `frontend`, `shared`
- **Backend:** Bun server with SQLite database
- **Frontend:** React 19 with React Router 7, TanStack Query, Tailwind CSS 4
- **Authentication:** SuperTokens (Google OAuth)
- **Code Quality:** Biome (formatting & linting)

## Developer Personas

### frodes (Frontend Developer/Designer)

Activate with `/frodes` to enable the frontend developer/designer persona.

## Development Workflow

```bash
bun dev           # Run frontend + backend
bun dev:auth      # Run all services including auth
bun format        # Format with Biome
bun lint          # Lint with Biome
bun check:fix     # Auto-fix lint/format issues
bun tsc           # Type check all packages
```

Auth override mode: set `ALLOW_AUTH_OVERRIDE=true` in `backend/.env` and `FRONTEND_OVERRIDE_AUTH=true` in `frontend/.env` to bypass OAuth in development. See `example.env` files for all env vars.

## Key Patterns

### Middleware Pattern
The backend uses composable middleware:
```typescript
withLogging(withAuthentication(handler))
```

### Response Utilities
`jsonResponseOr404()`, `forbiddenResponse()`, `notFoundResponse()`, `internalServerErrorResponse()`

### Type Safety
- Shared Zod schemas in `shared/browser/` for validation
- TypeScript types derived from schemas
- DTOs for API responses (e.g., replacing UUIDs with readable names)

### Database
- SQLite with `bun-sqlite-migrations`, migrations in `backend/migrations/`
- Tables: `print_queue`, `material`
- UUIDv7 for chronological ordering
- Prepared statements, transactions, type-safe query results

## Common Tasks

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

### Type Checking
Each package has its own `tsconfig.json` extending `tsconfig.base.json`.
The backend has a custom `tsc` script that filters out migration library errors.

## Deployment

Production uses Docker Compose (`docker-compose.prod.yml`). Each service has its own Dockerfile.
