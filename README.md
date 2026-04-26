# jobex

jobex is an AI-powered career path simulator built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, Supabase, and Google Gemini.

## What it does

- Skill gap analysis
- Timeline-based roadmap generation
- Portfolio project recommendations
- Mock interview simulation with scoring
- Career switch simulation

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Supabase Auth + Postgres
- Google Gemini via `@google/generative-ai`
- Deployable on Vercel free tier

## Environment variables

Create `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a new Supabase project.
2. In Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
3. In Authentication > Providers:
   - Enable Email
   - Enable Google OAuth if you want Google sign-in
   - Enable GitHub OAuth if you want GitHub sign-in
4. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`
5. Copy the project URL and anon key into `.env.local`.

## Architecture

```text
app/
  api/
    skill-gap/route.ts
    roadmap/route.ts
    projects/route.ts
    interview/route.ts
    career-switch/route.ts
  auth/callback/route.ts
  dashboard/page.tsx
  interview/page.tsx
  page.tsx
components/
  dashboard-client.tsx
  interview-client.tsx
  profile-form.tsx
  auth-panel.tsx
  ui/
ai/
  client.ts
  prompts.ts
  schemas.ts
  service.ts
supabase/
  client.ts
  server.ts
  schema.sql
types/
```

## AI implementation notes

- All AI calls use `gemini-3.1-flash-lite-preview`
- Temperature is set to `0.4`
- Responses are requested as JSON and validated with Zod
- Each AI route has a fallback response for resilience
- The UI surfaces fallback behavior instead of pretending the model never stumbled

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Add your production callback URL in Supabase Auth settings.
5. Deploy.

## Notes

- The dashboard profile persists to Supabase when a user is signed in.
- The `simulations` table is included for saving generated outputs if you want to extend the MVP.
- The current interview screen uses a built-in demo profile; a natural next step is sharing dashboard profile state across the app.
