# Movie-Flix Frontend

React + Vite frontend for Movie-Flix.

## Stack

- React 19
- Vite
- React Router
- Bootstrap
- Axios

## Run

```bash
cd frontend
npm install
npm run dev
```

The dev server binds to `0.0.0.0` so it can be opened from a phone on the same Wi-Fi network.

## Environment

Create a `.env` file if needed:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_PUBLIC_FRONTEND_URL=http://192.168.0.103:5173
```

- `VITE_API_BASE_URL` points the UI at the backend API.
- `VITE_PUBLIC_FRONTEND_URL` is used to generate the QR checkout link for mobile.

## Main Screens

- Home catalog with search and genre filters
- Movie details page
- QR checkout page
- My rentals
- Login and register screens

## Checkout Flow

1. User clicks `Rent` on a movie.
2. The app opens `/checkout/:movieId`.
3. The checkout page shows the movie, QR code, and payment summary.
4. On mobile, the QR opens the same checkout page using the LAN URL.
5. `Pay & Rent` creates a rental.
6. Logged-in users save the rental in the backend.
7. Guest checkouts are stored locally so they still appear in `My Rentals`.

## Frontend Structure

- `src/api` backend API wrappers
- `src/components` reusable UI
- `src/context` auth state
- `src/pages` route screens
- `src/routes` app routing
- `src/utils` shared helpers

## Useful Commands

```bash
npm run build
npm run lint
```
