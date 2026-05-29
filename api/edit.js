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
  if (req.method !== 'PUT') return res.status(405).json({ msg: 'Método não permitido' })

  const user = getUser(req)
  if (!user) return res.status(401).json({ msg: 'Token inválido' })

  const { form } = req.body
  if (!form?.TITULO) return res.status(400).json({ msg: 'formulario nao fornecido' })

  await connectDB()
  const Item = await List.findById(form._id)
  if (!Item) return res.json({ msg: 'Tarefa nao encontrada' })

  Item.TITULO = form.TITULO
  Item.DESCRICAO = form.DESCRICAO
  Item.PRIORIDADE = form.PRIORIDADE
  Item.STATUS = form.STATUS

  await Item.save()
  res.json({ msg: 'Tarefa Alterada!', Item })
}
