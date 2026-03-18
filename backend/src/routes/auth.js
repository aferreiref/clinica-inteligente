const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  res.json({
    message: 'Cadastro funcionando',
    user: { name, email, password }
  })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body

  res.json({
    message: 'Login funcionando',
    token: 'token-teste-123',
    user: { email, password }
  })
})

router.get('/me', (req, res) => {
  res.json({
    id: 1,
    name: 'Aline',
    email: 'aline@email.com',
    role: 'user'
  })
})

module.exports = router