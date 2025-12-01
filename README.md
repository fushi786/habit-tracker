text
# Habit Tracker

A minimalist, Supabase‑backed habit tracker built with Next.js. It lets you sign up, log in securely, and track daily habits through a clean, responsive interface.

## Features

- Email/password authentication via Supabase.
- Secure login and protected habit pages.
- Create, update, and delete habits.
- Daily check‑in UI for marking habits as done.
- Responsive layout styled for desktop and mobile.
- Deployed on Vercel for fast, global access.

## Tech Stack

- **Framework:** Next.js (React)
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS (plus custom theme)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js and npm (or pnpm/yarn) installed.
- A Supabase project with:
  - Project URL
  - Public anon key

### Environment variables

Create a `.env.local` file in the project root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

text

Do **not** commit real keys to Git.

### Install and run

install dependencies
npm install

or
yarn

or
pnpm install

run dev server
npm run dev

text

Then open `http://localhost:3000` in your browser.

## Project Structure

- `app/` or `pages/` – application routes (e.g. `/login`, `/`).
- `components/` – shared UI components.
- `lib/` – Supabase client and helpers.
- `styles/` – global styles and Tailwind config.

## Deployment

This app is configured for Vercel:

1. Push the repo to GitHub.
2. Create a new project on Vercel and import the repo.
3. In **Project Settings → Environment Variables**, add:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy. Every push to the main branch will trigger a new deployment.

## Future Improvements

- Streaks and statistics per habit.
- Tags or categories for habits.
- Dark/light theme toggle.
- Reminders or notification hooks.