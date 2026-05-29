import mongoose from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { Userr } from '../Backend/model/models.js'

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGO_URI)
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ msg: 'Método não permitido' })

  const { form } = req.body
  if (!form?.email || !form?.password)
    return res.status(400).json({ msg: 'Campos obrigatórios: email, password' })

  await connectDB()

  const user = await Userr.findOne({ EMAIL: form.email })
  if (!user) return res.json({ msg: 'Usuario não Encontrado' })

  const match = await argon2.verify(user.PASSWORD, form.password)
  if (!match) return res.json({ msg: 'Senha Incorreta!' })

  const token = jwt.sign(
    { id: user._id, NAME: user.NAME },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  )

  res.json({ msg: 'Login Realizado!', token })
}
