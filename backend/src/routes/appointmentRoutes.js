const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const { getWeatherForecast } = require('../services/weatherService')

/**
 * CRIAR AGENDAMENTO
 */
router.post('/', authMiddleware, (req, res) => {
  const { date, time, description } = req.body
  const userId = req.user.id

  if (!date || !time || !description) {
    return res.status(400).json({ message: 'Preencha todos os campos' })
  }

  const checkSql = `
    SELECT * FROM appointments
    WHERE date = ? AND time = ?
  `

  db.get(checkSql, [date, time], async (err, existingAppointment) => {
    if (err) {
      console.error('Erro ao verificar horário:', err)
      return res.status(500).json({ message: 'Erro ao verificar horário' })
    }

    if (existingAppointment) {
      return res.status(400).json({ message: 'Horário já está ocupado' })
    }

    let rainAlert = 0

    try {
      const city = process.env.CLINIC_CITY || 'Sao Paulo'
      const forecast = await getWeatherForecast(city)

      const dayForecasts = forecast.list.filter((item) => {
        return item.dt_txt.startsWith(date)
      })

      const willRain = dayForecasts.some((item) => {
        return item.weather.some((weatherItem) =>
          weatherItem.main.toLowerCase().includes('rain')
        )
      })

      rainAlert = willRain ? 1 : 0
    } catch (weatherError) {
      console.error('Erro ao consultar clima:', weatherError.message)
    }

    const insertSql = `
      INSERT INTO appointments (user_id, date, time, description, rain_alert)
      VALUES (?, ?, ?, ?, ?)
    `

    db.run(insertSql, [userId, date, time, description, rainAlert], function (err) {
      if (err) {
        console.error('Erro ao criar agendamento:', err)
        return res.status(500).json({ message: 'Erro ao criar agendamento' })
      }

      return res.status(201).json({
        message: rainAlert
          ? 'Agendamento criado com sucesso. Atenção: há previsão de chuva no dia.'
          : 'Agendamento criado com sucesso',
        id: this.lastID,
        rainAlert: !!rainAlert
      })
    })
  })
})

/**
 * LISTAR AGENDAMENTOS
 * - Admin vê todos
 * - Usuário comum vê só os seus
 */
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id
  const role = req.user.role

  let sql = ''
  let params = []

  if (role === 'admin') {
    sql = `
      SELECT * FROM appointments
      ORDER BY date, time
    `
  } else {
    sql = `
      SELECT * FROM appointments
      WHERE user_id = ?
      ORDER BY date, time
    `
    params = [userId]
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Erro real do SQLite:', err)
      return res.status(500).json({ message: 'Erro ao buscar agendamentos' })
    }

    return res.json(rows)
  })
})

/**
 * DELETAR AGENDAMENTO
 */
router.delete('/:id', authMiddleware, (req, res) => {
  const appointmentId = req.params.id
  const userId = req.user.id
  const role = req.user.role

  let sql = ''
  let params = []

  if (role === 'admin') {
    sql = `DELETE FROM appointments WHERE id = ?`
    params = [appointmentId]
  } else {
    sql = `DELETE FROM appointments WHERE id = ? AND user_id = ?`
    params = [appointmentId, userId]
  }

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Erro ao deletar agendamento:', err)
      return res.status(500).json({ message: 'Erro ao deletar agendamento' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado' })
    }

    return res.json({ message: 'Agendamento deletado com sucesso' })
  })
})

module.exports = router