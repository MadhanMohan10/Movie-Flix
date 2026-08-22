import { useEffect, useState } from 'react'
import { getMyRentals } from '../api/rentalApi'
import { getMovieDetails } from '../api/movieApi'
import { clearAuth } from '../utils/auth'
import { readGuestRentals } from '../utils/guestRentals'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import RentalCard from '../components/rental/RentalCard'
import { useAuth } from '../hooks/useAuth'

export default function MyRentals() {
  const { auth, isAuthenticated, logout } = useAuth()
  const [rentals, setRentals] = useState([])
  const [rentalMovies, setRentalMovies] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadRentals() {
      setLoading(true)
      setError(null)
      try {
        const data = isAuthenticated && auth?.token
          ? await getMyRentals(auth.token)
          : readGuestRentals()

        if (!active) return
        setRentals(data)

        const moviePairs = await Promise.all(
          data.map(async (rental) => {
            try {
              const movie = await getMovieDetails(rental.movieId)
              return [rental.movieId, movie]
            } catch {
              return [rental.movieId, null]
            }
          }),
        )

        if (active) {
          setRentalMovies(Object.fromEntries(moviePairs))
        }
      } catch (err) {
        if (!active) return

        const message = err.message || ''
        if (message.toLowerCase().includes('unauthorized') || message.includes('401')) {
          clearAuth()
          logout()
          return
        }

        setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadRentals()

    return () => {
      active = false
    }
  }, [auth?.token, isAuthenticated, logout])

  return (
    <main className="container-fluid px-4 px-lg-5 py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <span className="eyebrow">Your library</span>
          <h1 className="section-title mt-2">My rentals</h1>
        </div>
      </div>

      {loading ? <Loading label="Loading rentals..." /> : null}
      <ErrorMessage message={error} />

      {!loading && !error ? (
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            {rentals.length ? (
              <div className="list-group list-group-flush rentals-list page-card p-3">
                {rentals.map((rental) => (
                  <RentalCard
                    key={rental.id}
                    rental={rental}
                    movie={rentalMovies[rental.movieId]}
                  />
                ))}
              </div>
            ) : (
              <div className="page-card p-4">
                <h3 className="mb-2">No rentals yet</h3>
                <p className="text-body-secondary mb-0">
                  Rent a movie from the checkout page and it will show up here.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}
