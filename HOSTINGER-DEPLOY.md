# Deploying Linkslo on Hostinger

## 1. Which Hostinger plan do you need?

This is a **Next.js app with a server-side API and a PostgreSQL database** — it is
not a static HTML site. It needs a host that can run a persistent Node.js
process.

| Plan | Will this work? |
|---|---|
| Shared / Business / Premium Web Hosting (cPanel) | ❌ No persistent Node.js process, no PostgreSQL. This plan is for PHP/WordPress sites. |
| Hostinger **VPS** | ✅ Yes — you get a real Linux server, full control. |
| Hostinger Business/Cloud plans with the **"Node.js App"** feature in hPanel | ⚠️ Partially — it can run the Node.js process, but you will still need an external PostgreSQL database (see step 3), because these plans only ship MySQL. |

If you are not on a VPS, the easiest fully-working alternative is deploying
this exact project to **Vercel** (free tier, built for Next.js) and pointing
your `linkslo.com` domain (bought on Hostinger) at it via DNS. The steps below
assume you are deploying on a **Hostinger VPS**; the same `npm install` /
`npm run build` / `npm start` commands work identically on Vercel or any other
Node.js host.

## 2. Required environment variables

Copy `.env.example` to `.env` on the server and fill in real values:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxx
```

Never commit a real `.env` file to git or include it in a zip you share.

## 3. Database

This project uses PostgreSQL via Drizzle ORM. On a VPS you can either:

- **Install Postgres on the same VPS** (`apt install postgresql`), create a
  database and user, and use `postgresql://user:pass@localhost:5432/dbname`, or
- **Use a free managed Postgres** (simpler, no server maintenance) — e.g.
  [Neon](https://neon.tech) or [Supabase](https://supabase.com) both have a
  free tier and give you a ready-made `DATABASE_URL`.

Once `DATABASE_URL` is set, push the schema (creates all tables):

```bash
npx drizzle-kit push
```

The product catalogue (8,886 gigs, articles, case studies, FAQs, etc.) seeds
itself automatically the first time the site receives a request — no manual
seed command needed.

## 4. Google sign-in (Clerk)

1. Sign up free at [clerk.com](https://clerk.com) and create an application.
2. Enable "Google" as a sign-in method (one click, works immediately —
   no Google Cloud Console setup needed).
3. Copy the **Publishable key** and **Secret key** from the Clerk dashboard
   into your `.env` file (see step 2).

## 5. Build and run

```bash
npm install
npm run build
npm start
```

`npm start` runs `next start`, which listens on port 3000 by default. On a
VPS, put this behind a reverse proxy (nginx) and a process manager (PM2) so it
restarts automatically and survives reboots:

```bash
npm install -g pm2
pm2 start npm --name linkslo -- start
pm2 save
pm2 startup
```

Then point nginx at `http://127.0.0.1:3000` for your domain, and set up a
free SSL certificate with Certbot.

## 6. Connecting the linkslo.com domain

If the app is running elsewhere (e.g. Vercel) and the domain is registered on
Hostinger:

1. In your hosting/Vercel project settings, add `linkslo.com` as a custom domain.
   It will show you the exact DNS records to add (usually an `A` record and a
   `CNAME` for `www`).
2. In Hostinger's hPanel → **Domains** → **DNS / Name Servers** → **DNS Zone
   Editor**, add those exact records.
3. DNS changes can take anywhere from a few minutes to a few hours to apply.

## 7. What NOT to do

- Do not use `output: "export"` / static export — this project has API routes,
  a database and authentication, none of which work as static HTML.
- Do not commit `node_modules/` or a real `.env` file to any repository.
- Do not try to run this on shared/cPanel hosting without a Node.js app
  runtime and an external Postgres database — it will not work.
