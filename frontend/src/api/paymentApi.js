import axiosClient from './axiosClient'

function authConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export async function createMockPayment(movieId, token) {
  const { data } = await axiosClient.post(
    '/api/payments/mock',
    { movieId },
    authConfig(token),
  )

  return data
}
