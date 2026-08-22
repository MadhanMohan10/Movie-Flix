const GUEST_RENTALS_KEY = 'movieflix.guestRentals'

export function readGuestRentals() {
  try {
    const raw = localStorage.getItem(GUEST_RENTALS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeGuestRentals(rentals) {
  localStorage.setItem(GUEST_RENTALS_KEY, JSON.stringify(rentals))
}

export function addGuestRental(movieId, movieTitle) {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const rental = {
    id: `guest-${now.getTime()}`,
    movieId: Number(movieId),
    rentedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'COMPLETED',
    amount: '5.00',
    currency: 'USD',
    movieTitle: movieTitle || `Movie ${movieId}`,
  }

  const rentals = readGuestRentals()
  const nextRentals = [rental, ...rentals.filter((entry) => entry.movieId !== rental.movieId)]
  writeGuestRentals(nextRentals)

  return rental
}
