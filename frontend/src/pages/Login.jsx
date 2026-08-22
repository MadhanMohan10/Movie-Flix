import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'
import { useAuth } from '../hooks/useAuth'

const emptyForm = {
  email: '',
  password: '',
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await loginUser(form)
      login({
        id: result.id,
        name: result.name,
        email: result.email,
        token: result.token,
      })
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card page-card auth-hero">
        <div className="mb-4">
          <span className="eyebrow">Welcome back</span>
          <h1 className="section-title mt-2">Login to Movie-Flix</h1>
          <p className="text-body-secondary mb-0">Sign in to explore movies, rent titles, and manage access.</p>
        </div>

        <ErrorMessage message={error} />
        {loading ? <Loading label="Signing you in..." /> : null}

        <form onSubmit={handleSubmit} className={loading ? 'd-none' : ''}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>
          <button className="btn btn-warning w-100" type="submit">
            Login
          </button>
        </form>

        <div className="mt-3 small text-body-secondary d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <span>No account yet?</span>
          <Link className="btn btn-outline-light btn-sm" to="/register">
            Sign up
          </Link>
        </div>
      </section>
    </main>
  )
}
