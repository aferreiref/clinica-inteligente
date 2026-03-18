<template>
  <div class="admin-page">
    <div class="admin-card">
      <div class="top-bar">
        <div>
          <h1>Painel Administrativo</h1>
          <p class="subtitle">Gerencie todos os agendamentos da clínica</p>
        </div>

        <button class="logout-btn" @click="logout">Sair</button>
      </div>

      <div class="admin-info">
        <p><strong>Nome:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Perfil:</strong>
          <span class="badge">Administrador</span>
        </p>
      </div>

      <div class="section-header">
        <h2>Todos os agendamentos</h2>
        <button class="refresh-btn" @click="loadAppointments">Atualizar</button>
      </div>

      <p v-if="loading" class="info-message">Carregando agendamentos...</p>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <div v-if="!loading && appointments.length === 0" class="empty-box">
        Nenhum agendamento encontrado.
      </div>

      <div v-if="!loading && appointments.length > 0" class="table-wrapper">
        <table class="appointments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Descrição</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
              <td>{{ appointment.id }}</td>
              <td>{{ appointment.user_name || 'Usuário' }}</td>
              <td>{{ formatDate(appointment.date) }}</td>
              <td>{{ appointment.time }}</td>
              <td>{{ appointment.description }}</td>
              <td>
                <button
                  class="delete-btn"
                  @click="handleDelete(appointment.id)"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const appointments = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const user = ref({
  name: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || ''
})

function formatDate(date: string) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

async function loadAppointments() {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const data = await api.getAppointments()
    appointments.value = data
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar agendamentos'
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  const confirmDelete = window.confirm('Tem certeza que deseja excluir este agendamento?')

  if (!confirmDelete) return

  try {
    error.value = ''
    success.value = ''

    await api.deleteAppointment(id)
    success.value = 'Agendamento excluído com sucesso!'

    await loadAppointments()
  } catch (err: any) {
    error.value = err.message || 'Erro ao excluir agendamento'
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')

  router.push('/login')
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #eef4ff 0%, #f5ecff 100%);
}

.admin-card {
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 18px 50px rgba(31, 41, 55, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.top-bar h1 {
  margin: 0;
  font-size: 2.2rem;
  color: #0f172a;
}

.subtitle {
  margin-top: 8px;
  color: #64748b;
}

.logout-btn,
.refresh-btn,
.delete-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn {
  background: #0f172a;
  color: white;
}

.refresh-btn {
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.logout-btn:hover,
.refresh-btn:hover,
.delete-btn:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.admin-info {
  background: #f8fafc;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 28px;
}

.admin-info p {
  margin: 8px 0;
  color: #1e293b;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #4338ca;
  font-weight: 700;
  font-size: 0.92rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  color: #111827;
}

.info-message,
.error-message,
.success-message {
  margin: 12px 0;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 600;
}

.info-message {
  background: #eff6ff;
  color: #1d4ed8;
}

.error-message {
  background: #fef2f2;
  color: #b91c1c;
}

.success-message {
  background: #ecfdf5;
  color: #047857;
}

.empty-box {
  padding: 24px;
  border-radius: 16px;
  background: #f8fafc;
  color: #475569;
  text-align: center;
  border: 1px dashed #cbd5e1;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: white;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table th,
.appointments-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.appointments-table th {
  background: #f8fafc;
  color: #334155;
  font-size: 0.95rem;
}

.appointments-table td {
  color: #111827;
}

@media (max-width: 768px) {
  .admin-card {
    padding: 20px;
  }

  .top-bar,
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .top-bar h1 {
    font-size: 1.8rem;
  }
}
</style>