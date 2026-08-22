import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createMockPayment } from '../api/paymentApi'
import { createRental, getMyRentals } from '../api/rentalApi'
import { getMovieDetails } from '../api/movieApi'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import { useAuth } from '../hooks/useAuth'
import { addGuestRental, readGuestRentals } from '../utils/guestRentals'
import { formatDate, formatRating, formatRuntime, posterUrl } from '../utils/movie'

export default function PaymentCheckoutPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { auth, isAuthenticated } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [rentalsLoaded, setRentalsLoaded] = useState(false)
  const [rentedMovieIds, setRentedMovieIds] = useState([])
  const [processing, setProcessing] = useState(false)
  const [publicFrontendUrl, setPublicFrontendUrl] = useState(() => {
    if (typeof window === 'undefined') {
      return import.meta.env.VITE_PUBLIC_FRONTEND_URL?.replace(/\/$/, '') || ''
    }

    return (
      window.localStorage.getItem('movieflix.publicFrontendUrl') ||
      import.meta.env.VITE_PUBLIC_FRONTEND_URL?.replace(/\/$/, '') ||
      ''
    )
  })
  const [urlDraft, setUrlDraft] = useState(publicFrontendUrl)

  const checkoutUrl = useMemo(() => {
    const baseUrl =
      publicFrontendUrl ||
      (typeof window === 'undefined' ? '' : window.location.origin)

    if (!baseUrl) {
      return `/checkout/${movieId}`
    }

    return `${baseUrl}/checkout/${movieId}`
  }, [movieId, publicFrontendUrl])

  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(checkoutUrl)}`
  }, [checkoutUrl])

  function handleSavePublicUrl() {
    const normalized = urlDraft.trim().replace(/\/$/, '')

    setPublicFrontendUrl(normalized)

    if (typeof window !== 'undefined') {
      if (normalized) {
        window.localStorage.setItem('movieflix.publicFrontendUrl', normalized)
      } else {
        window.localStorage.removeItem('movieflix.publicFrontendUrl')
      }
    }
  }

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
    let active = true

    async function loadRentals() {
      try {
        if (isAuthenticated && auth?.token) {
          const rentals = await getMyRentals(auth.token)
          if (active) {
            setRentedMovieIds(rentals.map((rental) => rental.movieId))
          }
        } else if (active) {
          const rentals = readGuestRentals()
          setRentedMovieIds(rentals.map((rental) => rental.movieId))
        }
      } catch {
        if (active) {
          setRentedMovieIds([])
        }
      } finally {
        if (active) {
          setRentalsLoaded(true)
        }
      }
    }

    setRentalsLoaded(false)
    void loadRentals()

    return () => {
      active = false
    }
  }, [auth?.token, isAuthenticated])

  const movieNumericId = Number(movieId)
  const alreadyRented = rentedMovieIds.includes(movieNumericId)
  const checkoutHost = (() => {
    try {
      return new URL(checkoutUrl, window.location.origin).hostname
    } catch {
      return ''
    }
  })()
  const checkoutLooksLocal =
    checkoutHost === 'localhost' ||
    checkoutHost === '127.0.0.1' ||
    checkoutHost === '0.0.0.0'

  async function handlePayAndRent() {
    setProcessing(true)
    setNotice(null)

    try {
      let payment
      let rental

      if (isAuthenticated && auth?.token) {
        payment = await createMockPayment(movieId, auth.token)
        rental = await createRental(movieId, auth.token)
      } else {
        payment = {
          status: 'COMPLETED',
        }
        rental = addGuestRental(movieId, movie?.title)
      }

      setNotice({
        type: 'success',
        text: `Payment ${payment.status.toLowerCase()} and rental created. Rental ID ${rental.id}.`,
      })
      setRentedMovieIds((current) => Array.from(new Set([...current, movieNumericId])))

      window.setTimeout(() => {
        navigate('/rentals')
      }, 1200)
    } catch (err) {
      setNotice({ type: 'danger', text: err.message })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="checkout-page">
      <section className="checkout-shell container-fluid px-4 px-lg-5 py-4 py-lg-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <span className="eyebrow">Scan to checkout</span>
            <h1 className="section-title mt-2 mb-0">Movie payment</h1>
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light" to="/rentals">
              My Rentals
            </Link>
          </div>
        </div>

        {loading ? <Loading label="Loading checkout..." /> : null}
        <ErrorMessage message={error} />
        {notice ? <div className={`alert alert-${notice.type}`}>{notice.text}</div> : null}

        {movie ? (
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <article className="page-card checkout-card h-100 p-4">
                <div className="checkout-hero mb-4">
                  <img src={posterUrl(movie.poster_path)} alt={movie.title} className="checkout-poster" />
                  <div className="checkout-copy">
                    <span className="eyebrow">Secure mock payment</span>
                    <h2 className="checkout-title mt-2">{movie.title}</h2>
                    <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
                      <span className="detail-pill detail-pill-light">{formatDate(movie.release_date)}</span>
                      <span className="detail-pill detail-pill-rating">Rating {formatRating(movie.vote_average)}</span>
                      {movie.runtime ? <span className="detail-pill detail-pill-dark">{formatRuntime(movie.runtime)}</span> : null}
                      <span className={`detail-pill ${alreadyRented ? 'detail-pill-success' : 'detail-pill-dark'}`}>
                        {alreadyRented ? 'Already rented' : 'Ready to rent'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="checkout-summary">
                  <h3 className="section-title h5 mb-3">Checkout summary</h3>
                  <div className="checkout-line">
                    <span>Movie</span>
                    <strong>{movie.title}</strong>
                  </div>
                  <div className="checkout-line">
                    <span>Reference</span>
                    <strong>TMDB #{movie.id}</strong>
                  </div>
                  <div className="checkout-line">
                    <span>Payment method</span>
                    <strong>Phone scan QR</strong>
                  </div>
                  <div className="checkout-line">
                    <span>Status</span>
                    <strong>{alreadyRented ? 'Rented' : 'Awaiting payment'}</strong>
                  </div>
                  <div className="checkout-line checkout-total">
                    <span>Total</span>
                    <strong>$5.00 USD</strong>
                  </div>
                </div>

                <p className="checkout-note mt-4 mb-0">
                  Scan the QR with your phone, review the movie, and tap pay. The demo checkout will create a rental
                  record and show it in rentals immediately.
                </p>
              </article>
            </div>

            <div className="col-12 col-lg-5">
              <article className="page-card checkout-card checkout-qr-panel h-100 p-4">
                <div className="checkout-qr-frame mb-3">
                  <img src={qrUrl} alt="Checkout QR code" className="checkout-qr" />
                </div>

                <div className="text-center">
                  <span className="eyebrow">Open on phone</span>
                  <h2 className="section-title h4 mt-2">Scan to view checkout details</h2>
                  <p className="checkout-note">
                    The QR points back to this checkout page so you can review the film and pay from any device.
                  </p>
                </div>

                <div className="token-preview checkout-link-preview mt-3">{checkoutUrl}</div>

                <div className="mt-3">
                  <label className="form-label small text-body-secondary">
                    Public checkout URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="http://192.168.0.103:1573"
                    value={urlDraft}
                    onChange={(event) => setUrlDraft(event.target.value)}
                  />
                  <div className="d-flex gap-2 mt-2">
                    <button type="button" className="btn btn-outline-light btn-sm" onClick={handleSavePublicUrl}>
                      Save URL
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => {
                        setUrlDraft('')
                        setPublicFrontendUrl('')
                        if (typeof window !== 'undefined') {
                          window.localStorage.removeItem('movieflix.publicFrontendUrl')
                        }
                      }}
                    >
                      Use current host
                    </button>
                  </div>
                  {checkoutLooksLocal ? (
                    <div className="alert alert-warning mt-3 mb-0">
                      This QR still points to a local address. Paste the phone-reachable LAN URL above and save it.
                    </div>
                  ) : null}
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-warning btn-lg"
                    onClick={handlePayAndRent}
                    disabled={processing || alreadyRented}
                  >
                    {processing ? 'Processing...' : alreadyRented ? 'Already rented' : 'Pay & Rent'}
                  </button>
                </div>

                <div className="checkout-mini mt-4">
                  <div className="checkout-line">
                    <span>Payment status</span>
                    <strong>{rentalsLoaded ? (isAuthenticated ? 'Session ready' : 'Guest mode') : 'Loading...'}</strong>
                  </div>
                  <div className="checkout-line">
                    <span>Amount</span>
                    <strong>$5.00 USD</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
