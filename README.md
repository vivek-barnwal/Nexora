# Nexora

Nexora is a React + TypeScript web app for discovering and exploring world affairs, AI developments, engineering trends, research, and emerging tools in one place.

## Features

- Browse curated topical sections such as world, AI, models, tools, research, and engineering
- Search and filter within the content experience
- Modern dark-themed UI powered by Tailwind CSS
- Supabase-ready bookmark flow for saving items

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- React Router

## Prerequisites

- Node.js 18+
- npm
- A Supabase project with a public URL and anon key

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   copy .env.example .env
   ```

3. Add your Supabase credentials to the new `.env` file:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in the terminal.

## Production Build

```bash
npm run build
```

## Supabase

This project includes database migrations and an ingestion function under the `supabase/` folder for app data and bookmark storage.

## Project Structure

```text
.
├── src/
├── supabase/
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.cjs
├── README.md
└── .gitignore
```

## Deployment

The app is configured for GitHub Pages deployment through a GitHub Actions workflow. To enable it:

1. Push this repository to GitHub.
2. Open GitHub repository settings.
3. Go to Pages and set the source to GitHub Actions.
4. Add the required secrets in repository settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

The workflow will automatically build and publish the app on each push to `main`.
