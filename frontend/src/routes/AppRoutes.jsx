import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import MovieDetailsPage from '../pages/MovieDetailsPage'
import PaymentCheckoutPage from '../pages/PaymentCheckoutPage'
import MyRentals from '../pages/MyRentals'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'

function AppFrame({ backendStatus }) {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Navbar backendStatus={backendStatus} />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movies/:movieId" element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
        <Route path="/checkout/:movieId" element={<PaymentCheckoutPage />} />
        <Route path="/rentals" element={<MyRentals />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function AppRoutes({ backendStatus }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<AppFrame backendStatus={backendStatus} />} />
      </Routes>
    </BrowserRouter>
  )
}
