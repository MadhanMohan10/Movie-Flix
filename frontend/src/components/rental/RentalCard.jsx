import { NavLink } from 'react-router-dom'
import { formatDateTime, formatRating, formatDate, posterUrl } from '../../utils/movie'

export default function RentalCard({ rental, movie }) {
  return (
    <div className="list-group-item rental-item">
      <div className="rental-row">
        <img
          src={posterUrl(movie?.poster_path)}
          alt={movie?.title || `Movie ${rental.movieId}`}
          className="rental-thumb"
        />

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <div className="fw-semibold rental-title">{movie?.title || `Movie ID ${rental.movieId}`}</div>
              <div className="small text-body-secondary">Rental #{rental.id}</div>
            </div>
            <span className="badge text-bg-dark">Expires {formatDateTime(rental.expiresAt)}</span>
          </div>

          {movie ? (
            <div className="movie-mini-meta mt-2">
              <span>{formatDate(movie.release_date)}</span>
              <span>{formatRating(movie.vote_average)}</span>
            </div>
          ) : null}

          <div className="small text-body-secondary mt-2">
            Rented at {formatDateTime(rental.rentedAt)}
          </div>

          <div className="d-flex gap-2 flex-wrap mt-3">
            <NavLink to={`/movies/${rental.movieId}`} className="btn btn-outline-light btn-sm">
              View data
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
