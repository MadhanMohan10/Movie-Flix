import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import MovieCard from './MovieCard'

export default function MovieGrid({
  movies,
  loading,
  error,
  isLoggedIn,
  onRent,
  rentedMovieIds = [],
  emptyTitle = 'No results yet',
  emptyBody = 'Search for movies to see the catalog.',
}) {
  if (loading) {
    return <Loading label="Searching movies..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!movies.length) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
      </div>
    )
  }

  return (
    <div className="row movie-grid g-0">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isLoggedIn={isLoggedIn}
          onRent={onRent}
          rented={rentedMovieIds.includes(movie.id)}
        />
      ))}
    </div>
  )
}
