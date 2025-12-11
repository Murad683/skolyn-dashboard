# Skolyn Dashboard

Skolyn is an explainable AI dashboard for radiologists, featuring image upload, AI-assisted findings, comparison tools, and analytics.

## Tech stack
- React + TypeScript (Vite)
- Tailwind CSS + shadcn/ui
- React Router, React Query, Recharts, Radix primitives

## Getting started
1) Install dependencies:
```sh
npm install
```
2) Start the dev server:
```sh
npm run dev
```
3) Build for production:
```sh
npm run build
```
4) Preview the production build:
```sh
npm run preview
```

## Project scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run lint` – lint the project
- `npm run preview` – preview the production build

## Notes
- Environment variables can be added via `.env` files using the `VITE_` prefix.
- Assets placed in `public/` are served at the site root.
