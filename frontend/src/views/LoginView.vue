<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>

      <form @submit.prevent="handleLogin" class="form">
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

        <button type="submit">Entrar</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="register-link">
        Não tem conta?
        <router-link to="/register">Cadastrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')

async function handleLogin() {
  try {
    error.value = ''

    const response = await api.login({
      email: form.value.email,
      password: form.value.password
    })

    // ✅ SALVAR TOKEN
    localStorage.setItem('token', response.token)

    // ✅ SALVAR DADOS DO USUÁRIO
    localStorage.setItem('userName', response.user.name)
    localStorage.setItem('userEmail', response.user.email)
    localStorage.setItem('userRole', response.user.role)

    // ✅ REDIRECIONAR
    router.push('/appointments')

  } catch (err: any) {
    error.value = err.message || 'Erro ao fazer login'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #dbeafe, #e9d5ff);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 350px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-card h1 {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.error {
  color: red;
  margin-top: 10px;
}

.register-link {
  margin-top: 10px;
  font-size: 14px;
}
</style>