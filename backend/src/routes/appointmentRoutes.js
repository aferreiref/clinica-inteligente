const express = require('express')
const db = require('../db')
const authMiddleware = require('../middleware/auth')
const weatherService = require('../services/weatherService')

const router = express.Router()

// Criar agendamento
router.post('/', authMiddleware, async (req, res) => {
  const { date, time, description } = req.body

  if (!date || !time) {
    return res.status(400).json({ message: 'Data e hora são obrigatórias.' })
  }

  try {
    // Verificar conflito
    db.get(
      'SELECT * FROM appointments WHERE date = ? AND time = ?',
      [date, time],
      async (err, existing) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao verificar horário.' })
        }

        if (existing) {
          return res.status(400).json({ message: 'Horário já ocupado.' })
        }

        let weather = null

        try {
          weather = await weatherService.getWeatherByDate(date)
        } catch (err) {
          console.log('Erro ao buscar clima:', err.message)
        }

        db.run(
          'INSERT INTO appointments (user_id, date, time, description, weather) VALUES (?, ?, ?, ?, ?)',
          [
            req.user.id,
            date,
            time,
            description,
            weather || null
          ],
          function (err) {
            if (err) {
              return res.status(500).json({ message: 'Erro ao criar agendamento.' })
            }

            return res.status(201).json({
              message: 'Agendamento criado com sucesso.',
              id: this.lastID,
              weather
            })
          }
        )
      }
    )
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno.' })
  }
})

// Listar
router.get('/', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM appointments WHERE user_id = ?',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar agendamentos.' })
      }

      res.json(rows)
    }
  )
})

module.exports = router