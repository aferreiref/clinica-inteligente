const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// ======================
// REGISTER
// ======================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha nome, email e senha.' })
  }

  const userRole = role || 'patient'

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ message: 'E-mail já cadastrado.' })
          }

          return res.status(500).json({ message: 'Erro ao cadastrar usuário.' })
        }

        return res.status(201).json({
          message: 'Usuário cadastrado com sucesso.',
          user: {
            id: this.lastID,
            name,
            email,
            role: userRole
          }
        })
      }
    )
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
})

// ======================
// LOGIN
// ======================
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha email e senha.' })
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar usuário.' })
      }

      if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' })
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      return res.json({
        message: 'Login realizado com sucesso.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    }
  )
})

// ======================
// ME (usuário logado)
// ======================
router.get('/me', authMiddleware, (req, res) => {
  db.get(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar usuário.' })
      }

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' })
      }

      return res.json(user)
    }
  )
})

module.exports = router