# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + production build (tsc && vite build)
npm run preview    # Preview production build
npm run lint       # ESLint over src/
```

No test runner is configured.

## Environment

Copy `.env.example` to `.env` and fill in:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the backend must be running locally.

## Architecture

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS, React Router v6, TanStack Query v5, Zustand, Stripe, react-hook-form, react-hot-toast.

### Path Aliases

Defined in `vite.config.ts`. Always use these instead of relative imports:

| Alias | Path |
|---|---|
| `@atoms` | `src/atomic/atoms` |
| `@molecules` | `src/atomic/molecules` |
| `@organisms` | `src/atomic/organisms` |
| `@templates` | `src/atomic/templates` |
| `@pages` | `src/atomic/pages` |
| `@api` | `src/api` |
| `@hooks` | `src/hooks` |
| `@store` | `src/store` |
| `@utils` | `src/utils` |
| `@t` | `src/types` |

### Atomic Design Structure

UI lives under `src/atomic/` following strict atomic design layers:
- **atoms** — primitive components: `Button`, `Input`, `Badge`, `Spinner`, `Avatar`
- **molecules** — composed UI: `FormField`, `CourseCard`, `BlogCard`, `PricingCard`
- **organisms** — feature sections: `LoginForm`, `RegisterForm`
- **templates** — full layouts: `MainLayout`, `AuthLayout`, `DashboardLayout`, `AdminLayout`
- **pages** — route-level components (one folder per route)

Each component lives in its own folder with an `index.tsx` entry.

### Routing

`src/router/routes.tsx` defines all routes using `createBrowserRouter`. Routes are Spanish (`/cursos`, `/eventos`, `/blog`, `/mi-cuenta`, `/admin`). Two route guards exist:
- `ProtectedRoute` — redirects unauthenticated users to `/iniciar-sesion`
- `AdminRoute` — restricts `/admin/*` to users with `role === 'admin'`

### API Layer

`src/api/client.ts` is the single HTTP client (native `fetch`, no axios). It:
- Reads `VITE_API_URL` for the base URL
- Attaches `Authorization: Bearer <token>` from `authStore`
- Automatically retries once after refreshing tokens on 401 responses
- Calls `authStore.logout()` when refresh fails

Each domain has its own API module (`auth.api.ts`, `courses.api.ts`, `events.api.ts`, `blog.api.ts`, `subscriptions.api.ts`, `payments.api.ts`) that wraps `client` and unwraps `ApiResponse<T>`.

### State Management

Three Zustand stores in `src/store/`:
- `authStore` — `user`, `accessToken`, `refreshToken`, `isAuthenticated`; persisted to `localStorage` as `dd-auth`
- `cartStore` — shopping cart items; persisted to `localStorage` as `dd-cart`
- `uiStore` — ephemeral UI state (mobile menu, search panel); not persisted

### Data Fetching Pattern

Custom hooks in `src/hooks/` wrap TanStack Query. Use these hooks in components; don't call `@api` modules directly from pages. Mutations use `useMutation`, reads use `useQuery`. Query client is configured with `staleTime: 5min` and `retry: 1`.

### Types

All shared domain types are in `src/types/index.ts`. Backend documents use both `id` and `_id` (MongoDB), so both are typed as optional. Key types: `User`, `Course`, `Lesson`, `Event`, `BlogPost`, `Subscription`, `Order`, `ApiResponse<T>`, `PaginatedResponse<T>`, `AuthResult`.
