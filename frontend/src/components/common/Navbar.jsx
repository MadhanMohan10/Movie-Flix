import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/rentals', label: 'My Rentals' },
]

export default function Navbar({ backendStatus }) {
  const navigate = useNavigate()
  const { auth, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container-fluid px-4 px-lg-5">
        <NavLink className="navbar-brand fw-semibold tracking-wide" to="/">
          Movie-Flix
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#movieflixNavbar"
          aria-controls="movieflixNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="movieflixNavbar">
          <ul className="navbar-nav ms-lg-4 me-auto gap-lg-1">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink className="nav-link" to={item.to} end={item.to === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`status-pill ${backendStatus}`}>
              <span className="status-dot" />
              {backendStatus === 'online'
                ? 'Backend online'
                : backendStatus === 'offline'
                  ? 'Backend offline'
                  : 'Checking backend'}
            </span>

            <span className="navbar-text user-chip">{auth?.name || 'Account'}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
