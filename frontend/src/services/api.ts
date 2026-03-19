const API_URL = 'https://clinica-backend.onrender.com'

async function request(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('token')

  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição')
  }

  return data
}

export default {
  async login(data: { email: string; password: string }) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async register(data: {
    name: string
    email: string
    password: string
    role: string
  }) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async getAppointments() {
    return request('/appointments')
  },

  async createAppointment(data: {
    date: string
    time: string
    description: string
  }) {
    return request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async deleteAppointment(id: number) {
    return request(`/appointments/${id}`, {
      method: 'DELETE'
    })
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