# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Print Flow is a 3D print queue management system. Users submit print requests, track status, and admins manage the queue. Monorepo with 4 Bun workspaces: `backend`, `frontend`, `auth`, `shared`.

## Developer Personas

### frodes (Frontend Developer/Designer)

Activate with `/frodes` to enable the frontend developer/designer persona.

## Commands

```bash
bun dev           # Run frontend + backend (dev mode)
bun dev:auth      # Run all services including auth
bun format        # Format with Biome
bun lint          # Lint with Biome
bun check:fix     # Auto-fix lint/format issues
bun tsc           # Type check all packages
```

No test runner is configured.

## Architecture

**Backend** (`backend/`) — Bun server (port 3001) with SQLite. Routes defined in `backend/index.ts`. Services in `backend/src/`: `PrintQueueService`, `UserService`, `UserPermissionService`, `S3Service`, `PrintCoreService`. Middleware is composable: `withLogging(withAuthentication(handler))`. Response helpers: `jsonResponseOr404()`, `forbiddenResponse()`, `notFoundResponse()`, `internalServerErrorResponse()`.

**Frontend** (`frontend/`) — React 19, React Router 7, TanStack Query, Tailwind CSS 4, shadcn/ui (Radix). Pages in `frontend/src/pages/`, queries in `frontend/src/queries.ts`. Dev server (`frontend/dev-server.ts`) proxies `/api` to backend:3001 and `/auth` to auth:8000.

**Auth** (`auth/`) — Express server (port 8000) wrapping SuperTokens Core. Handles Google OAuth and email/password. Backend validates JWTs via JWKS.

**Shared** (`shared/`) — Split into `shared/browser/` (Zod schemas, types used by both frontend and backend) and `shared/node/` (server-only utilities like logging with pino).

**Storage** — SQLite for data, S3 for file uploads (presigned URLs for direct client upload). Migrations in `backend/migrations/` using `bun-sqlite-migrations`.

**External integrations** — Printables/MakerWorld image scraping, PrintCore API (BAMBU printer control via SSH tunnel).

## Key Patterns

- **Database**: UUIDv7 for IDs (chronological ordering). Prepared statements with type-safe results. Tables: `print_queue`, `material`.
- **Type safety**: Zod schemas in `shared/browser/` are the source of truth. TypeScript types derived from schemas. DTOs transform internal entities to API responses (e.g., user UUID → fullName).
- **Permissions**: Roles (`USER`, `ADMIN`) map to permissions (`read_queue`, `approve_print`, `manage_users`, `view_users`). Checked via `authDetails.permissions.has()` in route handlers. Defined in `shared/browser/user.ts`.
- **Auth override**: Set `ALLOW_AUTH_OVERRIDE=true` in `backend/.env` and `FRONTEND_OVERRIDE_AUTH=true` in `frontend/.env` to bypass OAuth during development. See `example.env` files in each service.

## Common Tasks

**New API endpoint**: Add route in `backend/index.ts` → wrap with `withLogging(withAuthentication())` → implement handler in appropriate service → add schemas in `shared/browser/` if needed.

**New frontend page**: Create component in `frontend/src/pages/` → add route in routing config → use TanStack Query for data fetching → import types from `shared/browser/`.

**Type checking**: Each package has its own `tsconfig.json` extending `tsconfig.base.json`. The backend has a custom `tsc` script that filters out migration library errors.
