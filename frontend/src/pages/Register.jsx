import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import ErrorMessage from '../components/common/ErrorMessage'
import Loading from '../components/common/Loading'

const emptyForm = {
  name: '',
  email: '',
  password: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await registerUser(form)
      setSuccess(`Account created for ${result.email}. You can log in now.`)
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 800)
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
          <span className="eyebrow">Get started</span>
          <h1 className="section-title mt-2">Create an account</h1>
          <p className="text-body-secondary mb-0">Register once and unlock the rental workflow.</p>
        </div>

        <ErrorMessage message={error} />
        {success ? <div className="alert alert-success">{success}</div> : null}
        {loading ? <Loading label="Creating account..." /> : null}

        <form onSubmit={handleSubmit} className={loading ? 'd-none' : ''}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>
          <button className="btn btn-warning w-100" type="submit">
            Create account
          </button>
        </form>

        <div className="mt-3 small text-body-secondary d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <span>Already have an account?</span>
          <Link className="btn btn-outline-light btn-sm" to="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  )
}
