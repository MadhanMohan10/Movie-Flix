export default function MovieSearch({
  query,
  onQueryChange,
  onSubmit,
  genres = [],
  selectedGenreIds = [],
  onGenreToggle,
  onClearGenres,
  loading,
}) {
  const selectedCount = selectedGenreIds.length

  return (
    <form
      className="search-panel"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="search-controls d-flex flex-column flex-lg-row gap-2 align-items-stretch">
        <div className="input-group input-group-lg flex-grow-1">
          <input
            className="form-control form-control-lg search-input"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search movies"
          />
          <button className="btn btn-warning px-4" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Go'}
          </button>
        </div>

        <div className="dropdown genre-dropdown-wrap">
          <button
            className="btn btn-outline-light dropdown-toggle w-100"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            Genres {selectedCount ? `(${selectedCount})` : ''}
          </button>

          <div className="dropdown-menu dropdown-menu-dark p-3 genre-dropdown">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
              <span className="text-body-secondary small">Select one or more genres</span>
              <button type="button" className="btn btn-link btn-sm p-0 text-warning" onClick={onClearGenres}>
                Clear
              </button>
            </div>

            <div className="genre-checklist">
              {genres.map((genre) => (
                <label key={genre.id} className="dropdown-item genre-option rounded-3">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={selectedGenreIds.includes(genre.id)}
                    onChange={(event) => onGenreToggle(genre.id, event.target.checked)}
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
