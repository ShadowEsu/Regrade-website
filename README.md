# Regrade

Premium landing page for [regradeapp.tech](https://regradeapp.tech).

## Ownership

**Copyright © 2026 Preston Jay Susanto. All rights reserved.**

Regrade, including this repository, is **proprietary** — not open source.
The Regrade name and logo are trademarks of Preston Jay Susanto.

- [LICENSE](./LICENSE) — proprietary terms; no redistribution without permission
- [NOTICE](./NOTICE) — copyright and trademark notice
- [CONTRIBUTING.md](./CONTRIBUTING.md) — required terms for any contributor

Unauthorized copying, forking, or use of this code is prohibited.

## Stack

- **Vite + React 19 + TypeScript** — fast builds, type-safe components
- **Tailwind CSS v4** — design tokens, responsive layout
- **Framer Motion** — preloader, staggered hero, FAQ accordion, sticky CTA, cursor glow
- **GSAP + ScrollTrigger** — product parallax, feature deep-dive scrub animations
- **Lenis** — buttery smooth scroll (synced with GSAP)
- **Lucide React** — crisp iconography
- **Supabase** — waitlist RPC, live stats, visitor analytics

## Backend (Supabase)

| RPC | Purpose |
|-----|---------|
| `join_waitlist` | Sign up + return queue position |
| `get_waitlist_stats` | Live waitlist total & spots left |
| `register_visitor` | Anonymous visitor tracking |
| `get_visitor_stats` | Site traffic aggregates |

View signups: [Supabase table editor](https://supabase.com/dashboard/project/lshqzxgzehgmzgeilvmy/editor)

The public Supabase key is intentionally configured for the landing page. Server-side secrets must
never be added to this static site.

### Google Analytics

Analytics is wired but intentionally disabled until a real Measurement ID is supplied. Set
`VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in the production build environment, then redeploy. The
loader sends no Analytics request when that variable is absent.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Waitlist

Signups write to the `waitlist` table in Supabase (`Regrade-waitlist` project). View entries in the [Supabase dashboard](https://supabase.com/dashboard/project/lshqzxgzehgmzgeilvmy/editor).
