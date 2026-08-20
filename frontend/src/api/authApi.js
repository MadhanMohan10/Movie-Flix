import axiosClient from './axiosClient'

export async function registerUser(payload) {
  const { data } = await axiosClient.post('/api/users', payload)
  return data
}

export async function loginUser(payload) {
  const { data } = await axiosClient.post('/api/auth/login', payload)
  return data
}
