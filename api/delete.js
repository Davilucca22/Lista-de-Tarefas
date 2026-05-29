import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { List } from '../Backend/model/models.js'

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGO_URI)
}

function getUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, process.env.JWT_SECRET) } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ msg: 'Método não permitido' })

  const user = getUser(req)
  if (!user) return res.status(401).json({ msg: 'Token inválido' })

  const { IdItem } = req.query
  if (!IdItem) return res.status(400).json({ msg: 'ID nao enviado' })

  await connectDB()
  const deleted = await List.findByIdAndDelete(IdItem)
  if (!deleted) return res.json({ msg: 'Item nao encontrado no Banco de Dados' })

  res.json({ msg: 'Item excluido' })
}
