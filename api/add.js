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
  if (req.method !== 'POST') return res.status(405).json({ msg: 'Método não permitido' })

  const user = getUser(req)
  if (!user) return res.status(401).json({ msg: 'Token inválido' })

  const { form } = req.body
  if (!form?.titulo) return res.status(400).json({ msg: 'informe o Titulo!' })

  await connectDB()
  const addToList = await List.create({
    ID_USER: user.id,
    TITULO: form.titulo,
    DESCRICAO: form.descricao || '',
    PRIORIDADE: form.prioridade,
    STATUS: form.status,
  })

  res.json({ msg: 'Tarefa Adicionada!', addToList })
}
