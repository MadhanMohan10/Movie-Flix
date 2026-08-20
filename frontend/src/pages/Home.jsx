import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRental, getMyRentals } from '../api/rentalApi'
import { getMoviesByGenres, getPopularMovies, searchMovies } from '../api/movieApi'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import MovieGrid from '../components/movie/MovieGrid'
import MovieSearch from '../components/movie/MovieSearch'
import { useAuth } from '../hooks/useAuth'
import { MOVIE_GENRES } from '../utils/constants'

export default function Home() {
  const navigate = useNavigate()
  const { auth, isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState('popular')
  const [selectedGenreIds, setSelectedGenreIds] = useState([])
  const [popularData, setPopularData] = useState(null)
  const [catalogState, setCatalogState] = useState({
    loading: true,
    error: null,
    data: null,
  })
  const [rentedMovieIds, setRentedMovieIds] = useState([])
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let active = true

    async function loadPopular() {
      setCatalogState((current) => ({ ...current, loading: true, error: null }))
      try {
        const data = await getPopularMovies(1)
        if (!active) return

        setPopularData(data)
        setCatalogState({ loading: false, error: null, data })
        setPage(1)
        setMode('popular')
        setSelectedGenreIds([])
      } catch (error) {
        if (active) {
          setCatalogState({ loading: false, error: error.message, data: null })
        }
      }
    }

    void loadPopular()

    return () => {
      active = false
    }
  }, [])

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

  async function showPopular(pageNumber = 1) {
    if (pageNumber === 1 && popularData) {
      setQuery('')
      setSelectedGenreIds([])
      setMode('popular')
      setPage(1)
      setCatalogState({ loading: false, error: null, data: popularData })
      return
    }

    setMode('popular')
    setPage(pageNumber)
    setCatalogState((current) => ({ ...current, loading: true, error: null }))

    try {
      const data = await getPopularMovies(pageNumber)
      if (pageNumber === 1) {
        setPopularData(data)
      }
      setCatalogState({ loading: false, error: null, data })
    } catch (error) {
      setCatalogState({ loading: false, error: error.message, data: null })
    }
  }

  async function showGenres(genreIds, pageNumber = 1) {
    if (!genreIds.length) {
      await showPopular(1)
      return
    }

    setMode('genres')
    setPage(pageNumber)
    setCatalogState((current) => ({ ...current, loading: true, error: null }))

    try {
      const data = await getMoviesByGenres(genreIds, pageNumber)
      setCatalogState({ loading: false, error: null, data })
    } catch (error) {
      setCatalogState({ loading: false, error: error.message, data: null })
    }
  }

  async function runSearch(pageNumber = 1) {
    const normalized = query.trim()

    if (!normalized) {
      if (selectedGenreIds.length) {
        await showGenres(selectedGenreIds, pageNumber)
        return
      }

      await showPopular(pageNumber)
      return
    }

    setMode('search')
    setSelectedGenreIds([])
    setPage(pageNumber)
    setCatalogState((current) => ({ ...current, loading: true, error: null }))

    try {
      const data = await searchMovies(normalized, pageNumber)
      setCatalogState({ loading: false, error: null, data })
    } catch (error) {
      setCatalogState({ loading: false, error: error.message, data: null })
    }
  }

  async function handleGenreToggle(genreId, checked) {
    const nextGenreIds = checked
      ? Array.from(new Set([...selectedGenreIds, genreId]))
      : selectedGenreIds.filter((id) => id !== genreId)

    setSelectedGenreIds(nextGenreIds)
    setQuery('')
    await showGenres(nextGenreIds, 1)
  }

  async function clearGenres() {
    setSelectedGenreIds([])
    await showPopular(1)
  }

  async function loadCatalogPage(nextPage = 1) {
    if (mode === 'search') {
      await runSearch(nextPage)
      return
    }

    if (mode === 'genres') {
      await showGenres(selectedGenreIds, nextPage)
      return
    }

    await showPopular(nextPage)
  }

  async function handleRent(movieId) {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setNotice(null)
    try {
      const rental = await createRental(movieId, auth.token)
      setNotice({ type: 'success', text: `Rental created successfully. Rental ID ${rental.id}.` })
      setRentedMovieIds((current) => Array.from(new Set([...current, movieId])))
    } catch (error) {
      setNotice({ type: 'danger', text: error.message })
    }
  }

  const movies = catalogState.data?.results ?? []
  const selectedGenres = MOVIE_GENRES.filter((genre) => selectedGenreIds.includes(genre.id))
  const catalogTitle =
    mode === 'search'
      ? query.trim()
        ? `Results for "${query.trim()}"`
        : 'Search results'
      : mode === 'genres' && selectedGenres.length
        ? selectedGenres.map((genre) => genre.name).join(', ')
        : 'Popular movies'
  const emptyTitle =
    mode === 'search'
      ? 'No search results'
      : mode === 'genres' && selectedGenres.length
        ? 'No movies match those genres'
        : 'No popular movies yet'

  return (
    <main className="container-fluid px-4 px-lg-5 py-4">
      <section className="page-card p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <span className="eyebrow">Browse movies</span>
            <h1 className="section-title mt-2 mb-0">Search and filter</h1>
          </div>
        </div>

        <MovieSearch
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => void runSearch(1)}
          genres={MOVIE_GENRES}
          selectedGenreIds={selectedGenreIds}
          onGenreToggle={(genreId, checked) => void handleGenreToggle(genreId, checked)}
          onClearGenres={() => void clearGenres()}
          loading={catalogState.loading}
        />
      </section>

      {notice ? <div className={`alert alert-${notice.type} mt-4`}>{notice.text}</div> : null}
      <ErrorMessage message={catalogState.error} />

      <section className="mt-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <span className="eyebrow">{mode === 'genres' && selectedGenres.length ? 'Filtered by genres' : 'Catalog'}</span>
            <h2 className="section-title mt-2">{catalogTitle}</h2>
          </div>
          {catalogState.data ? (
            <div className="text-body-secondary small">
              Showing {movies.length} of {catalogState.data.total_results.toLocaleString()} movies
            </div>
          ) : null}
        </div>

        {catalogState.loading && !catalogState.data ? <Loading label="Loading movies..." /> : null}

        {catalogState.data ? (
          <>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div className="text-body-secondary small">
                Page {catalogState.data.page} of {catalogState.data.total_pages || 1}
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  disabled={page <= 1 || catalogState.loading}
                  onClick={() => void loadCatalogPage(Math.max(1, page - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  disabled={page >= (catalogState.data.total_pages || 1) || catalogState.loading}
                  onClick={() => void loadCatalogPage(Math.min(catalogState.data.total_pages || 500, page + 1))}
                >
                  Next
                </button>
              </div>
            </div>

            <MovieGrid
              movies={movies}
              loading={catalogState.loading && !movies.length}
              error={null}
              isLoggedIn={isAuthenticated}
              onRent={handleRent}
              rentedMovieIds={rentedMovieIds}
              emptyTitle={emptyTitle}
              emptyBody="Try another title or clear the genre filters."
            />
          </>
        ) : null}
      </section>
    </main>
  )
}
