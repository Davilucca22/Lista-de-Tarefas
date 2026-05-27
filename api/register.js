import mongoose from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { Userr } from '../Backend/model/modelUser.js'

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGO_URI)
}

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ msg: 'Método não permitido' })

  const { form } = req.body
  if (!form?.name || !form?.email || !form?.password)
    return res.status(400).json({ msg: 'Campos obrigatórios: name, email, password' })

  await connectDB()

  const existing = await Userr.findOne({ EMAIL: form.email })
  if (existing) return res.json({ msg: 'Email ja Cadastrado!' })

  const hash = await argon2.hash(form.password)
  const user = await Userr.create({ NAME: form.name, EMAIL: form.email, PASSWORD: hash })
  const token = jwt.sign(
    { id: user._id, NAME: form.name },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  )

  res.json({ msg: 'Seja Bem Vindo!', token })
}
