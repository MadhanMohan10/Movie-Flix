import axiosClient from './axiosClient'

export async function getHealth() {
  const { data } = await axiosClient.get('/api/health')
  return data
}

export async function searchMovies(query, page = 1) {
  const { data } = await axiosClient.get('/api/movies/search', {
    params: { query, page },
  })
  return data
}

export async function getPopularMovies(page = 1) {
  const { data } = await axiosClient.get('/api/movies/popular', {
    params: { page },
  })
  return data
}

export async function getMoviesByGenre(genreId, page = 1) {
  const { data } = await axiosClient.get(`/api/movies/genre/${genreId}`, {
    params: { page },
  })
  return data
}

export async function getMoviesByGenres(genreIds, page = 1) {
  const { data } = await axiosClient.get('/api/movies/genres', {
    params: {
      genreIds: genreIds.join(','),
      page,
    },
  })
  return data
}

export async function getMovieDetails(movieId) {
  const { data } = await axiosClient.get(`/api/movies/${movieId}`)
  return data
}
