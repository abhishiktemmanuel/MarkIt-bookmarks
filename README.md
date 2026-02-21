# MarkIt — Smart Bookmark Manager

> Your private bookmarks. Always in sync.

A minimal, real-time bookmark manager with Google sign-in, instant cross-tab sync. Built with Next.js 15, Supabase, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

---

## Features

- 🔐 **Google-only sign-in** — no passwords, session persists across refreshes
- 🔒 **Strictly private** — Row Level Security enforced at the database level
- ⚡ **Real-time sync** — bookmarks update instantly across all open tabs
- 📁 **Collections** — organize bookmarks into folders
- 📦 **Archive** — stash bookmarks without deleting them
- 🌙 **Glassmorphism UI** — polished, responsive design with dark mode tokens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL + RLS) |
| Real-time | Supabase Realtime (WebSockets) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/glass-whisper-bookmarks.git
cd glass-whisper-bookmarks
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy your **Project URL** and **anon key**

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Database Schema

Open the **Supabase SQL Editor** and run the contents of [`supabaseSchema.sql`](./supabaseSchema.sql).

This creates:
- `bookmarks` + `collections` tables
- Row Level Security policies (`user_id = auth.uid()` on all operations)
- Realtime enabled on both tables
- Performance indexes

### 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Create OAuth 2.0 Client**
2. Add this **Authorized redirect URI**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
3. In Supabase → **Authentication → Providers → Google**: paste your Client ID & Secret

### 6. Configure Supabase Redirect URLs

In Supabase → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

### 7. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (AuthProvider, Toaster)
│   ├── page.tsx            # Auth gate + all state management
│   ├── globals.css         # Tailwind + glassmorphism tokens
│   └── auth/callback/      # OAuth redirect handler
├── components/             # All UI components
├── context/
│   └── AuthContext.tsx     # Google OAuth session
├── hooks/
│   └── useRealtimeSync.ts  # Supabase Realtime subscriptions
├── lib/
│   ├── api.ts              # All Supabase CRUD operations
│   └── supabase/           # Browser + server clients
├── middleware.ts           # Session cookie refresh
└── types/
    └── index.ts            # DB types + UI mappers
```

## Security

- **Row Level Security** is enabled on all tables — every query is scoped to `auth.uid()`
- `user_id` is **never supplied by the client** — it's set by a database default to `auth.uid()`
- The Supabase `service_role` key is never exposed to the client
- No API routes bypass RLS

---

## License

MIT
