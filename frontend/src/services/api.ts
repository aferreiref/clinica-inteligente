const API_URL = 'http://localhost:3001'

type LoginData = {
  email: string
  password: string
}

type RegisterData = {
  name: string
  email: string
  password: string
  role: string
}

type AppointmentData = {
  date: string
  time: string
  description: string
}

function getToken() {
  return localStorage.getItem('token')
}

async function handleResponse(response: Response) {
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Ocorreu um erro na requisição')
  }

  return result
}

export default {
  async login(data: LoginData) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async createAppointment(data: AppointmentData) {
    const token = getToken()

    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    return handleResponse(response)
  },

  async getAppointments() {
    const token = getToken()

    const response = await fetch(`${API_URL}/appointments`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return handleResponse(response)
  },

  async deleteAppointment(id: number) {
    const token = getToken()

    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return handleResponse(response)
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