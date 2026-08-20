import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMovieDetails } from '../api/movieApi'
import { createRental, getMyRentals } from '../api/rentalApi'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'
import MovieDetails from '../components/movie/MovieDetails'
import { useAuth } from '../hooks/useAuth'

export default function MovieDetailsPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { auth, isAuthenticated } = useAuth()
  const [movie, setMovie] = useState(null)
  const [rentedMovieIds, setRentedMovieIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let active = true

    async function loadMovie() {
      setLoading(true)
      setError(null)
      try {
        const data = await getMovieDetails(movieId)
        if (active) setMovie(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadMovie()

    return () => {
      active = false
    }
  }, [movieId])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let active = true

    async function loadRentals() {
      try {
        const rentals = await getMyRentals(auth.token)
        if (active) {
          setRentedMovieIds(rentals.map((rental) => rental.movieId))
        }
      } catch {
        if (active) setRentedMovieIds([])
      }
    }

    void loadRentals()

    return () => {
      active = false
    }
  }, [auth?.token, isAuthenticated])

  const isRented = rentedMovieIds.includes(Number(movieId))

  async function handleRent(id) {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setNotice(null)
    try {
      const rental = await createRental(id, auth.token)
      setNotice({ type: 'success', text: `Rental created successfully. Rental ID ${rental.id}.` })
      setRentedMovieIds((current) => Array.from(new Set([...current, id])))
    } catch (err) {
      setNotice({ type: 'danger', text: err.message })
    }
  }

  return (
    <main className="container-fluid px-4 px-lg-5 py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <button type="button" className="btn btn-outline-light" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? <Loading label="Loading movie details..." /> : null}
      <ErrorMessage message={error} />
      {notice ? <div className={`alert alert-${notice.type}`}>{notice.text}</div> : null}
      {movie ? <MovieDetails movie={movie} isLoggedIn={isAuthenticated} onRent={handleRent} rented={isRented} /> : null}
    </main>
  )
}
