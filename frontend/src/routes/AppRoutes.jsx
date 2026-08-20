import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import MovieDetailsPage from '../pages/MovieDetailsPage'
import MyRentals from '../pages/MyRentals'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import { useAuth } from '../hooks/useAuth'

function AppFrame({ backendStatus }) {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Navbar backendStatus={backendStatus} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        <Route path="/rentals" element={<MyRentals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function AppRoutes({ backendStatus }) {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppFrame backendStatus={backendStatus} />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
