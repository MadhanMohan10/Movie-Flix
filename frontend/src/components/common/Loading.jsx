export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="py-5 text-center">
      <div className="spinner-border text-warning" role="status" aria-label={label} />
      <div className="mt-3 text-body-secondary">{label}</div>
    </div>
  )
}
