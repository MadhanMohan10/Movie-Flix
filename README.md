# Movie-Flix

Movie-Flix is a Spring Boot + React movie rental app that uses TMDB for movie data, JWT auth for users, and a mock payment flow for rentals.

## Project Layout

- `backend/` Spring Boot API
- `frontend/` React + Vite UI
- `backend/README.md` backend API and flow details
- `frontend/README.md` frontend setup and checkout flow

## What The App Does

- Browse popular movies and search TMDB titles
- View movie details
- Create users and log in with JWT
- Rent a movie
- Open a QR-based checkout page from mobile
- Save rentals in the backend for logged-in users
- Save demo rentals locally for guest checkout

## Setup

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

### Backend

- `tmdb.api.key`
- `tmdb.base-url`
- `movieflix.rental.duration-hours`
- `movieflix.payment.price`
- `movieflix.payment.currency`

### Frontend

- `VITE_API_BASE_URL` optional, if the API is not on the same origin
- `VITE_PUBLIC_FRONTEND_URL` recommended for QR checkout links, for example:

```bash
VITE_PUBLIC_FRONTEND_URL=http://192.168.0.103:5173
```

## Core Flow

1. User opens the app and browses movies.
2. Movie details page shows a `Rent` action.
3. Rent opens `/checkout/:movieId`.
4. The checkout page shows a QR code and payment summary.
5. Tapping `Pay & Rent` creates the rental.
6. Logged-in users save the rental in the backend.
7. Guest users get a local demo rental so it appears in `My Rentals`.

## API Overview

- `POST /api/users` create user
- `POST /api/auth/login` login and get JWT
- `GET /api/movies/search` search TMDB
- `GET /api/movies/popular` list popular movies
- `GET /api/movies/{movieId}` movie details
- `GET /api/rentals/my` list current user rentals
- `POST /api/rentals` create a rental
- `POST /api/payments/mock` mock payment flow
- `GET /api/health` health check

See the backend README for the full API and flow details.
