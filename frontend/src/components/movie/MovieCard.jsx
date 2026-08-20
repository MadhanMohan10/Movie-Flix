import { NavLink } from 'react-router-dom'
import { formatDate, formatRating, posterUrl } from '../../utils/movie'
import RentButton from '../rental/RentButton'

export default function MovieCard({ movie, isLoggedIn, onRent, rented }) {
  return (
    <div className="movie-grid-col">
      <article className="movie-card h-100">
        <NavLink to={`/movies/${movie.id}`} className="movie-card-media">
          <img
            src={posterUrl(movie.poster_path)}
            alt={movie.title}
            className="movie-poster"
            loading="lazy"
          />
        </NavLink>

        <div className="movie-card-body">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div>
              <h3 className="movie-title mb-1">{movie.title}</h3>
              <div className="movie-meta">{formatDate(movie.release_date)}</div>
            </div>
            <div className="d-flex flex-column align-items-end gap-2">
              <span className="rating-pill">{formatRating(movie.vote_average)}</span>
              {rented ? <span className="badge rounded-pill text-bg-success">Rented</span> : null}
            </div>
          </div>

          <p className="movie-overview">{movie.overview || 'No overview available.'}</p>

          <div className="d-flex gap-2 mt-auto flex-wrap">
            <NavLink to={`/movies/${movie.id}`} className="btn btn-outline-light btn-sm flex-grow-1">
              Details
            </NavLink>
            <RentButton movieId={movie.id} isLoggedIn={isLoggedIn} onRent={onRent} rented={rented} />
          </div>
        </div>
      </article>
    </div>
  )
}
