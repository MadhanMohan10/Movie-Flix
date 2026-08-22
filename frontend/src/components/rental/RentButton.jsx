export default function RentButton({ movieId, isLoggedIn, onRent, rented = false }) {
  return (
    <button
      type="button"
      className={`btn btn-sm flex-grow-1 ${rented ? 'btn-success' : 'btn-warning'}`}
      onClick={() => onRent(movieId)}
      disabled={rented}
      title={rented ? 'Already rented' : isLoggedIn ? 'Open checkout' : 'Open checkout'}
    >
      {rented ? 'Rented' : 'Rent'}
    </button>
  )
}
