# EverythingHighSchool

EverythingHighSchool is a Vite + React storefront and school-preparation experience for prospectus items, exam vouchers, ChopBox packages, schools, and student dashboards.

## Tech Stack

- Vite
- React
- TypeScript
- Supabase
- Tailwind CSS utilities from the existing project setup

## Local Setup

1. Install dependencies:
  ```powershell
  npm install
  ```

2. Create a local env file from the example:
  ```powershell
  copy .env.example .env.local
  ```

3. Fill in your Supabase values in `.env.local`.

## Environment Variables

Use these values in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## Development

Start the dev server:

```powershell
npm run dev
```

## Production Build

Build the app for production:

```powershell
npm run build
```

## Vercel Deployment

The project includes a Vite-friendly `vercel.json` configuration. Import the repository into Vercel, set the environment variables above, and deploy the generated `dist` output.

## Supabase Status

Supabase Auth and profile scaffolding are prepared in the repository, but the remote project link and production credentials still need to be set before the application can use live Supabase data.
  