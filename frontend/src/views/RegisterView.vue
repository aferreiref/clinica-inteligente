<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Cadastro</h1>
      <p class="subtitle">Crie sua conta para acessar o sistema da clínica</p>

      <form @submit.prevent="handleRegister" class="form">
        <input
          v-model="form.name"
          type="text"
          placeholder="Nome completo"
          required
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Senha"
          required
        />

        <select v-model="form.role" required>
          <option value="patient">Paciente</option>
          <option value="secretary">Secretário</option>
          <option value="admin">Administrador</option>
        </select>

        <input
          v-model="form.cep"
          type="text"
          placeholder="CEP"
          maxlength="9"
          @blur="handleCepBlur"
        />

        <input
          v-model="form.street"
          type="text"
          placeholder="Rua"
          readonly
        />

        <input
          v-model="form.district"
          type="text"
          placeholder="Bairro"
          readonly
        />

        <div class="row">
          <input
            v-model="form.city"
            type="text"
            placeholder="Cidade"
            readonly
          />

          <input
            v-model="form.state"
            type="text"
            placeholder="UF"
            readonly
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <p class="login-link">
        Já tem conta?
        <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'patient',
  cep: '',
  street: '',
  district: '',
  city: '',
  state: ''
})

function formatCep(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 8)
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
}

async function handleCepBlur() {
  try {
    error.value = ''

    const cleanCep = form.value.cep.replace(/\D/g, '')
    if (!cleanCep) return

    if (cleanCep.length !== 8) {
      throw new Error('Digite um CEP válido com 8 números')
    }

    const data = await api.getAddressByCep(cleanCep)

    form.value.street = data.logradouro || ''
    form.value.district = data.bairro || ''
    form.value.city = data.localidade || ''
    form.value.state = data.uf || ''
    form.value.cep = formatCep(cleanCep)
  } catch (err: any) {
    form.value.street = ''
    form.value.district = ''
    form.value.city = ''
    form.value.state = ''
    error.value = err.message || 'Erro ao buscar CEP'
  }
}

async function handleRegister() {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    await api.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role
    })

    success.value = 'Cadastro realizado com sucesso!'

    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (err: any) {
    error.value = err.message || 'Erro ao cadastrar'
    console.error('Erro no cadastro:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  background: linear-gradient(to right, #dbeafe, #e9d5ff);
}

.register-card {
  width: 100%;
  max-width: 460px;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.register-card h1 {
  margin: 0 0 8px;
  text-align: center;
  color: #111827;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 12px;
}

input,
select,
button {
  width: 100%;
  box-sizing: border-box;
}

input,
select {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
}

input[readonly] {
  background: #f8fafc;
  color: #475569;
}

button {
  margin-top: 6px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-weight: 600;
}

.success {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #ecfdf5;
  color: #047857;
  font-weight: 600;
}

.login-link {
  margin-top: 14px;
  text-align: center;
  color: #4b5563;
}

.login-link a {
  color: #4f46e5;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 520px) {
  .register-card {
    padding: 1.25rem;
  }

  .row {
    grid-template-columns: 1fr;
  }
}
</style>