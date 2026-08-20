import { backdropUrl, formatDate, formatRating, formatRuntime, posterUrl } from '../../utils/movie'
import RentButton from '../rental/RentButton'

export default function MovieDetails({ movie, isLoggedIn, onRent, rented = false }) {
  if (!movie) return null

  return (
    <div className="movie-details">
      <div
        className="movie-details-hero page-card"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.88) 48%, rgba(2, 6, 23, 0.58) 100%), url(${backdropUrl(movie.backdrop_path || movie.poster_path)})`,
        }}
      >
        <div className="movie-details-hero-copy">
          <span className="eyebrow">Movie details</span>
          <h1 className="movie-details-title mb-3">{movie.title}</h1>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span className="detail-pill detail-pill-light">{formatDate(movie.release_date)}</span>
            <span className="detail-pill detail-pill-rating">Rating {formatRating(movie.vote_average)}</span>
            {movie.runtime ? <span className="detail-pill detail-pill-dark">{formatRuntime(movie.runtime)}</span> : null}
            {rented ? <span className="detail-pill detail-pill-success">Rented</span> : null}
          </div>
          {movie.genres?.length ? (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {movie.genres.map((genre) => (
                <span key={genre.id ?? genre.name} className="badge rounded-pill text-bg-dark genre-pill">
                  {genre.name}
                </span>
              ))}
            </div>
          ) : null}
          <p className="movie-details-overview mb-0">{movie.overview || 'No overview available.'}</p>
        </div>
      </div>

      <div className="row g-4 align-items-start mt-0 movie-details-stack">
        <div className="col-12 col-md-4 col-xl-3">
          <img src={posterUrl(movie.poster_path)} alt={movie.title} className="movie-details-poster" />
        </div>
        <div className="col-12 col-md-8 col-xl-9">
          <div className="page-card movie-details-panel p-4">
            <div className="movie-details-grid">
              <div className="detail-card">
                <span className="detail-label">Release date</span>
                <strong>{formatDate(movie.release_date)}</strong>
              </div>
              <div className="detail-card">
                <span className="detail-label">Rating</span>
                <strong>{formatRating(movie.vote_average)}</strong>
              </div>
              <div className="detail-card">
                <span className="detail-label">Runtime</span>
                <strong>{movie.runtime ? formatRuntime(movie.runtime) : 'N/A'}</strong>
              </div>
              <div className="detail-card">
                <span className="detail-label">Status</span>
                <strong>{rented ? 'Rented' : 'Available'}</strong>
              </div>
            </div>

            <div className="movie-details-body mt-4">
              <h2 className="section-title mb-3">About this movie</h2>
              <p className="movie-details-text">{movie.overview || 'No overview available.'}</p>
            </div>

            <div className="d-flex gap-2 flex-wrap mt-4">
              <RentButton movieId={movie.id} isLoggedIn={isLoggedIn} onRent={onRent} rented={rented} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
