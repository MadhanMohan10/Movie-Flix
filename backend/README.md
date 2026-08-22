# Movie-Flix Backend

Spring Boot API for the Movie-Flix movie rental app.

## Stack

- Spring Boot 4
- Spring Web MVC
- Spring Security with JWT resource server
- Spring Data JPA
- PostgreSQL
- TMDB REST API

## Run

```bash
cd backend
./mvnw spring-boot:run
```

The app runs on `http://localhost:8080` by default.

## Configuration

Set these in `src/main/resources/application.properties`:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `tmdb.api.key`
- `tmdb.base-url`
- `movieflix.rental.duration-hours`
- `movieflix.payment.price`
- `movieflix.payment.currency`

## Security

- `POST /api/auth/login`, `POST /api/users`, `GET /api/health`, and all `/api/movies/**` endpoints are public.
- `/api/rentals/**` and `/api/payments/**` require a JWT bearer token.
- JWT auth is stateless.

## Domain Flow

### User auth

1. `POST /api/users` creates a user.
2. `POST /api/auth/login` verifies email and password.
3. On success, the backend returns a JWT and user profile data.

### Movie browse

1. `GET /api/movies/popular` loads popular titles from TMDB.
2. `GET /api/movies/search` searches titles by query.
3. `GET /api/movies/{movieId}` returns movie details.
4. `GET /api/movies/genre/{genreId}` and `GET /api/movies/genres` support genre browsing.

### Rental flow

1. Frontend opens `/checkout/:movieId`.
2. The checkout screen shows movie details and a QR link.
3. Logged-in users can complete payment and create a backend rental.
4. `POST /api/rentals` creates the rental record.
5. `GET /api/rentals/my` lists rentals for the current user.
6. `GET /api/rentals/{rentalId}/access` checks whether the rental is still active.

### Payment flow

1. `POST /api/payments/mock` creates a mock payment record.
2. The backend verifies the current user.
3. The backend verifies the movie exists in TMDB.
4. The backend stores the payment with a fixed demo amount and currency.
5. The frontend uses the payment result as part of the rental checkout flow.

## API Reference

### Auth

- `POST /api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

### Users

- `POST /api/users`

Request:

```json
{
  "name": "Madhan",
  "email": "user@example.com",
  "password": "secret"
}
```

### Movies

- `GET /api/movies/search?query=batman&page=1`
- `GET /api/movies/popular?page=1`
- `GET /api/movies/{movieId}`
- `GET /api/movies/genre/{genreId}?page=1`
- `GET /api/movies/genres?genreIds=28,12&page=1`

### Rentals

- `POST /api/rentals`

Request:

```json
{
  "movieId": 969681
}
```

- `GET /api/rentals/my`
- `GET /api/rentals/{rentalId}/access`

### Payments

- `POST /api/payments/mock`

Request:

```json
{
  "movieId": 969681
}
```

## Notes

- Payments are mock only. They do not connect to a real gateway.
- Guest checkout is handled in the frontend with local storage so the QR flow can be tested on a phone without a login session.
