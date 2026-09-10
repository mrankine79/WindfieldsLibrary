# Windfields Library

A Next.js site for the school library, with a password-protected management
panel for editing books, clubs, useful links, and purchase suggestions.

## How it's structured

- This repo is the **app** — pages, layout, styling, the management panel.
- Content (books, clubs, links, purchase suggestions) lives as JSON in a
  separate repo: [`windfieldslibrary-data`](https://github.com/mrankine79/windfieldslibrary-data).
  The app reads and writes that repo through the GitHub API at request
  time — it's never bundled into this app or committed here. That means
  editing a book, club, or link **never triggers a redeploy** of this app;
  the change is just a new commit to the data repo, and the site picks it
  up (within ~30 seconds, thanks to Next.js's fetch cache) on the next
  request.
- `/manage` is the admin panel. Log in with `MANAGEMENT_PASSWORD`.

## Environment variables (set these in Vercel → Project → Settings → Environment Variables)

| Variable | Description |
|---|---|
| `MANAGEMENT_PASSWORD` | Password to log into `/manage`. |
| `SESSION_SECRET` | Optional but recommended — a separate secret used to sign the admin session cookie. Generate with `openssl rand -hex 32`. Falls back to `MANAGEMENT_PASSWORD` if unset. |
| `GITHUB_TOKEN` | A GitHub Personal Access Token with **read/write access to the `windfieldslibrary-data` repo only** (a fine-grained token scoped to just that repo, "Contents: Read and write", is best). |
| `DATA_REPO_OWNER` | Defaults to `mrankine79`. |
| `DATA_REPO_NAME` | Defaults to `windfieldslibrary-data`. |
| `DATA_REPO_BRANCH` | Defaults to `main`. |

## Deploying on Vercel

1. Import this repo (`mrankine79/WindfieldsLibrary`) into Vercel — framework preset "Next.js" is auto-detected, no build config needed.
2. Add the environment variables above under Project Settings.
3. Deploy. Every push to `main` redeploys the app; content edits made through `/manage` do not (see above).

This app previously deployed as static HTML on Netlify — that's no longer
used. URLs also changed from `/fantasy.html` etc. to clean paths like
`/fantasy`.

## Local development

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```
