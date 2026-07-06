# GitHub Wrapped 🎉

A "Spotify Wrapped"-style animated summary of any GitHub user's coding year — built as a full-stack project with a Node/Express backend and a React frontend.

🔗 **Live demo:** [https://github-wrapped-frontend-gamma.vercel.app](https://github-wrapped-frontend-gamma.vercel.app)
🔗 **Backend repo:** [https://github.com/kinjalsharmaa/github-wrapped-backend](https://github.com/kinjalsharmaa/github-wrapped-backend)

## Features
- Enter any public GitHub username and get an animated, story-style "wrapped" recap
- Slide-by-slide reveal: repo count, top language, language breakdown chart, top starred repo
- Color-themed slides with smooth Framer Motion animations
- Downloadable summary card as a shareable PNG
- Fully responsive, dark-themed UI

## Tech Stack
**Frontend:** React (Vite), Framer Motion, Recharts, html2canvas
**Backend:** Node.js, Express
**Data:** GitHub public REST API
**Deployment:** Vercel (frontend), Render (backend)

## How it works
1. User enters a GitHub username
2. Frontend calls the backend, which fetches the user's profile and repo data from the GitHub API
3. Backend aggregates language usage and top repo, and returns clean JSON
4. Frontend renders it as an animated multi-slide experience

## Running locally

**Backend:**
```bash
cd github-wrapped-backend
npm install
node index.js
```

**Frontend:**
```bash
cd github-wrapped-frontend
npm install
npm run dev
```
Create a `.env` file in the frontend root with:
```
VITE_API_URL=http://localhost:3001
```

## What I learned
- Building and deploying a full-stack app (frontend + backend on separate hosts)
- Working with third-party REST APIs and shaping raw data for a UI
- Animation with Framer Motion (staggered reveals, page transitions)
- Client-side image generation with html2canvas
