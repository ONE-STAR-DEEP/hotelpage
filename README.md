# StayFinder — Hotel Search Application

Production-quality Next.js 15 foundation for a premium hotel search experience.

> **Scope of this phase:** project foundation only.  
> Search form, hotel cards, and API integration are intentionally deferred.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| Forms (next phase) | React Hook Form + Zod |
| Icons | Lucide React |
| Motion | Framer Motion |
| Quality | ESLint + Prettier |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in values. **Never** commit `.env.local` or hardcode API keys.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public | Canonical app URL |
| `NEXT_PUBLIC_API_BASE_URL` | Public | API base URL |
| `API_KEY` | Server only | Secret API credential |
| `API_TIMEOUT_MS` | Server only | Request timeout |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with autofix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run typecheck` | TypeScript `--noEmit` |

---

## Folder structure

```text
src/
├── app/                    # Next.js App Router (routes, layouts, loading/error)
│   └── (main)/             # Route group with shared chrome
├── components/
│   ├── ui/                 # Design-system primitives (Button, Card, Input…)
│   ├── layout/             # Header, Footer, MainLayout
│   ├── search/             # (reserved) search feature UI
│   ├── hotel/              # (reserved) hotel feature UI
│   └── error-boundary.tsx  # Reusable client Error Boundary
├── services/
│   └── api/                # Axios client + error normalization
├── hooks/                  # Reusable React hooks
├── types/                  # Centralized TypeScript contracts
├── schemas/                # Zod validation (separated from UI)
├── utils/                  # Pure helpers (cn, format)
├── constants/              # App-wide constants & routes
└── lib/                    # Env validation, shared infrastructure
```

Path aliases (configured in `tsconfig.json`):

```text
@/*            → src/*
@/components/* → src/components/*
@/services/*   → src/services/*
@/hooks/*      → src/hooks/*
@/types/*      → src/types/*
@/utils/*      → src/utils/*
@/constants/*  → src/constants/*
@/lib/*        → src/lib/*
@/schemas/*    → src/schemas/*
```

---

## Architecture

Clean separation of concerns:

| Concern | Location | Rule |
| --- | --- | --- |
| UI | `components/` | Presentational + composition only |
| Business logic | `lib/business/`, hooks | Pure / orchestrating — no raw HTTP |
| API layer | `services/` | All Axios / network I/O |
| Validation | `schemas/` | Zod schemas only |
| Types | `types/` | Shared contracts |
| Config / env | `lib/env.ts` | Zod-validated environment |

**Hard rules**

1. Components never call Axios directly.
2. API keys never use `NEXT_PUBLIC_` and never appear in client bundles.
3. Validation schemas are not defined inside components.
4. Types are imported from `@/types` — no ad-hoc inline domain models.

---

## Design system (foundation)

- Clean white surface, blue primary (`primary-600` / `#2563eb`)
- `rounded-xl` cards, soft shadows (`shadow-soft`)
- Plus Jakarta Sans for premium travel typography
- Responsive shell: mobile nav, tablet/desktop breakpoints
- Accessible primitives: labels, `aria-*`, focus rings, skip link

---

## Next phases

1. ~~Search form (React Hook Form + Zod schemas)~~
2. ~~Hotel card / results grid~~
3. ~~Hotel search API service + hooks~~
4. Filters sidebar, favorites, and booking checkout
5. External hotel provider adapter (Amadeus / Booking) behind the BFF

---

## How search works

```text
SearchForm (RHF + Zod — city required, rest optional)
    → router.push(/search?q=…)
        → useHotelSearch
            → services/hotels (Axios → our BFF)
                → GET /api/hotels/search
                    → SearchAPI Google Hotels (server-side api_key)
                        → map properties → hotel cards
```

Data source: **SearchAPI.io** `engine=google_hotels` (no hardcoded hotels).

Bonus: client sort (price / rating) + “Load more” via `next_page_token`.

---

## License

Private / proprietary — all rights reserved.
