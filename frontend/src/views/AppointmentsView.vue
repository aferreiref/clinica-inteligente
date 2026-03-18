<template>
  <div class="appointments-page">
    <div class="appointments-card">
      <div class="top-bar">
        <div>
          <h1>Agendamentos</h1>
          <p class="subtitle">Gerencie suas consultas</p>
        </div>

        <button class="logout-btn" @click="logout">Sair</button>
      </div>

      <div class="user-box">
        <p><strong>Nome:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Perfil:</strong>
          <span class="badge">{{ formatRole(user.role) }}</span>
        </p>
      </div>

      <div class="section">
        <h2>Novo agendamento</h2>

        <form @submit.prevent="handleSubmit" class="form">
          <input v-model="form.date" type="date" required />
          <input v-model="form.time" type="time" required />
          <input
            v-model="form.description"
            type="text"
            placeholder="Descrição da consulta"
            required
          />

          <button type="submit">Criar agendamento</button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Meus agendamentos</h2>
          <button class="refresh-btn" @click="loadAppointments">
            Atualizar
          </button>
        </div>

        <p v-if="loading" class="info">Carregando...</p>

        <div v-if="!loading && appointments.length === 0" class="empty">
          Nenhum agendamento encontrado.
        </div>

        <div class="appointments-list">
          <div
            v-for="appointment in appointments"
            :key="appointment.id"
            class="appointment-card"
          >
            <div class="row">
              <span><strong>Data:</strong> {{ formatDate(appointment.date) }}</span>
              <span><strong>Hora:</strong> {{ appointment.time }}</span>
            </div>

            <p class="description">
              {{ appointment.description }}
            </p>

            <!-- 🌧️ ALERTA DE CHUVA -->
            <p
              v-if="appointment.rain_alert === 1 || appointment.rainAlert"
              class="rain-alert"
            >
              🌧️ Atenção: previsão de chuva nesse dia
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({
  date: '',
  time: '',
  description: ''
})

const appointments = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const user = ref({
  name: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || '',
  role: localStorage.getItem('userRole') || ''
})

function formatRole(role: string) {
  if (role === 'admin') return 'Administrador'
  if (role === 'patient') return 'Paciente'
  if (role === 'secretary') return 'Secretário'
  return role
}

function formatDate(date: string) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

async function loadAppointments() {
  try {
    loading.value = true
    error.value = ''

    const data = await api.getAppointments()
    appointments.value = data
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar agendamentos'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    error.value = ''
    success.value = ''

    const result = await api.createAppointment(form.value)

    success.value = result.message

    form.value = {
      date: '',
      time: '',
      description: ''
    }

    await loadAppointments()
  } catch (err: any) {
    error.value = err.message || 'Erro ao criar agendamento'
  }
}

function logout() {
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.appointments-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #eef4ff, #f5ecff);
}

.appointments-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar h1 {
  margin: 0;
}

.subtitle {
  color: #64748b;
}

.logout-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.user-box {
  margin: 20px 0;
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
}

.badge {
  background: #e0e7ff;
  padding: 4px 10px;
  border-radius: 999px;
  color: #4338ca;
}

.section {
  margin-top: 25px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.refresh-btn {
  margin-left: auto;
  background: #4f46e5;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

.info {
  color: #555;
}

.empty {
  text-align: center;
  margin-top: 10px;
  color: #777;
}

.appointments-list {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointment-card {
  padding: 15px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.row {
  display: flex;
  justify-content: space-between;
}

.description {
  margin-top: 8px;
}

.rain-alert {
  margin-top: 10px;
  padding: 8px;
  background: #fff7ed;
  color: #b45309;
  border-radius: 8px;
  font-weight: bold;
}
</style>