import axiosClient from './axiosClient'

function authConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export async function createRental(movieId, token) {
  const { data } = await axiosClient.post(
    '/api/rentals',
    { movieId },
    authConfig(token),
  )
  return data
}

export async function getMyRentals(token) {
  const { data } = await axiosClient.get('/api/rentals/my', authConfig(token))
  return data
}

export async function checkRentalAccess(rentalId, token) {
  const { data } = await axiosClient.get(`/api/rentals/${rentalId}/access`, authConfig(token))
  return data
}
