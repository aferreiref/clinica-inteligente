const db = require('./db')

const email = 'alineferreirafreire@gmail.com'

db.run(
  `UPDATE users SET role = 'admin' WHERE email = ?`,
  [email],
  function (err) {
    if (err) {
      console.error('Erro ao atualizar usuário:', err.message)
    } else {
      console.log(`Usuários atualizados: ${this.changes}`)
    }

    db.close()
  }
)