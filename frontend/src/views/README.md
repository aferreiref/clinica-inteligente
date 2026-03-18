# 🏥 Sistema de Atendimento Inteligente para Clínicas Médicas

## 📌 Descrição

Este projeto é uma aplicação web desenvolvida para auxiliar clínicas médicas no gerenciamento de agendamentos de consultas.

O sistema permite cadastro e login de usuários, agendamento de consultas com validação de horários, integração com API de CEP para preenchimento automático de endereço, verificação de previsão do tempo e um painel administrativo para gerenciamento dos atendimentos.
https://viacep.com.br/ws/01001000/json/
---

## 🚀 Tecnologias Utilizadas

### Frontend
- Vue.js 3
- TypeScript
- Vite

### Backend
- Node.js
- Express

### Banco de Dados
- SQLite

### Autenticação
- JWT (JSON Web Token)

### APIs Externas
- ViaCEP (consulta de endereço por CEP)
- OpenWeather (previsão do tempo)

---

## ⚙️ Funcionalidades

- 👤 Cadastro de usuários (paciente, secretário e administrador)
- 🔐 Login com autenticação JWT
- 📅 Agendamento de consultas
- ⛔ Validação de horário duplicado
- 📍 Preenchimento automático de endereço por CEP
- 🌧️ Alerta de previsão de chuva no dia da consulta
- 📊 Painel administrativo com listagem de agendamentos
- 🗑️ Exclusão de agendamentos pelo administrador
- 🚪 Logout de usuário

---

## 🧩 Estrutura do Projeto

```bash
clinica-inteligente/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── server.js
│   ├── db.js
│   ├── clinica.sqlite
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── services/
│   │   ├── router/
│   │   └── App.vue
│   └── main.ts
│
└── README.md