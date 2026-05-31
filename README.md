# Subrat's 90-Day Interview Roadmap Tracker

A production-ready personal tracker for a 90-day frontend interview preparation journey. Built with **React 18 + Vite + TypeScript**.

## Features

- 📋 **6 tabs** — Overview, 12-week plan, Daily routine, Machine coding, LinkedIn, Interview tips
- ✅ **Progress tracking** — checkbox state persisted in Supabase
- 📅 **Daily log** — log study hours, DSA done, JS/React revision, notes
- 📤 **Export** — download logs as JSON
- 📋 **Copy** — one-click copy for LinkedIn post templates
- 🎬 **Animations** — Framer Motion accordion, smooth progress bar

## Tech Stack

- **React 18** + **TypeScript** (strict)
- **Vite** (build tool)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Supabase** (PostgreSQL database)
- **Vercel** (deployment)

## Local Development

```bash
npm install
cp .env.example .env.local   # add your Supabase keys
npm run dev
```

## Environment Variables

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Deploy

Deployed on Vercel. Push to `main` → auto-deploy.
