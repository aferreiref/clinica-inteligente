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
  // 🔐 LOGIN
  async login(email: string, password: string) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  // 📝 REGISTER
  async register(user: any) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user)
    })
  },

  // 📅 LISTAR AGENDAMENTOS
  async getAppointments() {
    return request('/appointments')
  },

  // ➕ CRIAR AGENDAMENTO
  async createAppointment(data: any) {
    return request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // ❌ DELETAR AGENDAMENTO
  async deleteAppointment(id: number) {
    return request(`/appointments/${id}`, {
      method: 'DELETE'
    })
  }
}