# Project Structure

This document is authoritative. All AI assistants (Claude, Copilot, etc.) and contributors MUST follow these conventions when adding or modifying files.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Runtime:** Node.js

## Directory Layout

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx          # Root layout (html/body shell, fonts)
│   ├── globals.css         # Global styles and Tailwind base
│   ├── favicon.ico
│   ├── (client)/           # Route group: browser-rendered pages (Navbar + Footer)
│   │   ├── layout.tsx      # Client layout (Navbar, Footer)
│   │   ├── page.tsx        # Home page (/)
│   │   ├── archive/
│   │   │   └── page.tsx    # Archive page (/archive)
│   │   └── articles/
│   │       └── [slug]/
│   │           └── page.tsx # Article detail page (/articles/:slug)
│   └── (api)/              # Route group: API route handlers
├── lib/                    # Shared utilities and client setup
│   ├── supabase.ts         # Supabase client instance
│   └── markdown.ts         # Markdown parsing helpers
├── queries/                # Data-fetching functions (one file per domain)
│   ├── posts.ts
│   ├── categories.ts
│   └── tags.ts
└── types/
    └── index.ts            # Shared TypeScript types/interfaces
```

## Conventions

### File placement rules

| What | Where |
|------|-------|
| Client page or route | `src/app/(client)/<path>/page.tsx` |
| API route handler | `src/app/(api)/<path>/route.ts` |
| Shared UI component | `src/components/<ComponentName>.tsx` (create if needed) |
| Supabase query / data fetch | `src/queries/<domain>.ts` |
| Singleton client / utility | `src/lib/<name>.ts` |
| Shared TypeScript types | `src/types/index.ts` |
| Static assets | `public/` |

### Code style

- **Arrow functions only** — never `function` declarations or `function` expressions.
- **TypeScript strict** — no `any`, no implicit returns.
- **No barrel `index.ts` re-exports** unless the directory has 3+ exports that are always imported together.
- **No default exports for utilities** — use named exports. Default exports are only for Next.js page/layout files (required by the framework).
- **No comments that describe what the code does** — only add a comment when the *why* is non-obvious.

### Naming

- React components: `PascalCase`
- Files for components: `PascalCase.tsx`
- Utility files, query files: `camelCase.ts`
- Routes/directories inside `app/`: `kebab-case`

### Data fetching

- All Supabase queries live in `src/queries/` — never inline them in page components.
- Use server components for data fetching by default; add `"use client"` only when interactivity requires it.

### Styling

- Tailwind utility classes only — no custom CSS except in `globals.css` for base/reset rules.
- No inline `style` props unless a value is truly dynamic and cannot be expressed as a Tailwind class.
