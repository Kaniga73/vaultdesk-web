import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})


api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('vaultdesk_user')
  if (savedUser) {
    const { token } = JSON.parse(savedUser)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api