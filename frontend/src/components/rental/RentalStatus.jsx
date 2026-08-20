import { formatDateTime } from '../../utils/movie'

export default function RentalStatus({ result }) {
  if (!result) return null

  return (
    <div className={`access-result mt-3 ${result.allowed ? 'allowed' : 'denied'}`}>
      <div className="d-flex justify-content-between align-items-center gap-2">
        <strong>{result.allowed ? 'Access granted' : 'Access denied'}</strong>
        <span className="badge rounded-pill text-bg-light text-dark">Rental #{result.rentalId}</span>
      </div>
      <div className="small mt-2">
        Movie ID {result.movieId} | Expires {formatDateTime(result.expiresAt)}
      </div>
    </div>
  )
}
