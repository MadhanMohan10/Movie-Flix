export default function RentButton({ movieId, isLoggedIn, onRent, rented = false }) {
  return (
    <button
      type="button"
      className={`btn btn-sm flex-grow-1 ${rented ? 'btn-success' : 'btn-warning'}`}
      onClick={() => onRent(movieId)}
      disabled={!isLoggedIn || rented}
      title={rented ? 'Already rented' : isLoggedIn ? 'Rent this movie' : 'Login to rent'}
    >
      {rented ? 'Rented' : isLoggedIn ? 'Rent' : 'Login to rent'}
    </button>
  )
}
