# William Aaron Turner

TanStack Start site, hosted on **Cloudflare Workers**.

## Hosting

Nitro's `cloudflare_module` preset builds it. `npm run build` writes the Worker to `.output/server` and static assets to `.output/public`, and generates `.output/server/wrangler.json` from the root `wrangler.jsonc`.

```bash
npm install
npm run dev               # Vite dev server
npm run build
npx wrangler dev          # local Workers runtime on the built output
npm run deploy:preview    # build, then upload a preview version (does not go live)
npm run deploy            # production deploy, which needs sign-off first
```

## Backend

None today. The site keeps no data of its own. If it ever needs a database, use the shared **Infinitum Corp** Supabase project (ref `ivqiskeziohbbtkcvlun`): give the product its own schema with RLS on, add migrations in `supabase/migrations/` and apply them with `npm run db:push`, and set `DATABASE_URL` as a Worker secret. Without `DATABASE_URL`, dev runs on embedded PGLite. Only the anon key may ever go to the browser.

## Environment variables

None are required. These are optional; set any secrets with `npx wrangler secret put <NAME>` and never commit them:

| Name | What it is |
|---|---|
| `DATABASE_URL` | Secret. Supabase transaction-pooler connection string (port 6543). Only needed once the site has a schema. |
| `GROK_PROJECT_ID`, `GROK_GATE_ORIGIN` | Grok App Builder gate. Leave unset outside Grok-hosted deploys. |
| `VITE_AUTH_ENABLED`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth, only if sign-in is turned on (off by default). |
