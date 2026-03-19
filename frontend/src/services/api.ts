import axios from 'axios'

const api = axios.create({
  baseURL: 'https://clinica-backend-gbtg.onrender.com'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default {
  async login(data: { email: string; password: string }) {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async register(data: {
    name: string
    email: string
    password: string
    role: string
  }) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async getAppointments() {
    const response = await api.get('/appointments')
    return response.data
  },

  async createAppointment(data: {
    date: string
    time: string
    description: string
  }) {
    const response = await api.post('/appointments', data)
    return response.data
  },

  async deleteAppointment(id: number) {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  },

  async getAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
      throw new Error('Digite um CEP válido com 8 números')
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()

    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    return data
  }
}