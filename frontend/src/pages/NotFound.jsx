import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-card page-card">
        <span className="eyebrow">404</span>
        <h1 className="section-title mt-2">Page not found</h1>
        <p className="text-body-secondary">The page you requested does not exist.</p>
        <Link to="/" className="btn btn-warning mt-2">
          Back to home
        </Link>
      </section>
    </main>
  )
}
