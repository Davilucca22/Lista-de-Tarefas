import mongoose from 'mongoose'
import { authenticateServerless } from './auth.js'

let connection

async function connectDatabase() {
  if (!process.env.MONGO_URI) throw new Error('A variável MONGO_URI não foi configurada.')
  if (mongoose.connection.readyState === 1) return
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connection = null
      throw error
    })
  }
  await connection
}

export function withDatabase(handler, { protectedRoute = false } = {}) {
  return async (req, res) => {
    try {
      await connectDatabase()
      if (protectedRoute) {
        req.user = await authenticateServerless(req, res)
        if (!req.user) return
      }
      return await handler(req, res)
    } catch (error) {
      console.error('Erro na função da API:', error)
      if (!res.headersSent) return res.status(500).json({ msg: 'Erro interno do servidor.' })
    }
  }
}
