import jwt from 'jsonwebtoken'
import { Userr } from '../model/models.js'

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

export function isInitialManagerEmail(email) {
  const configuredEmail = normalizeEmail(process.env.INITIAL_MANAGER_EMAIL || 'davi@gmail.com')
  return normalizeEmail(email) === configuredEmail
}

export async function findUserByEmail(email) {
  const escapedEmail = normalizeEmail(email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return Userr.findOne({ EMAIL: { $regex: `^${escapedEmail}$`, $options: 'i' } })
}

export function applyInitialManagerRole(user) {
  if (isInitialManagerEmail(user.EMAIL)) user.ROLE = 'manager'
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      NAME: user.NAME,
      ROLE: user.ROLE,
      TEAM: user.TEAM?.toString() ?? null,
    },
    process.env.JWT_SECRET,
    { expiresIn: '14d' },
  )
}

export async function getAuthenticatedUser(req) {
  const authorization = req.headers.authorization ?? req.header?.('Authorization')
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return null

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }

  const user = await Userr.findById(payload.id)
  if (!user) return null

  return {
    id: user._id.toString(),
    NAME: user.NAME,
    EMAIL: user.EMAIL,
    ROLE: user.ROLE,
    TEAM: user.TEAM?.toString() ?? null,
  }
}

export async function authenticateServerless(req, res) {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    res.status(401).json({ msg: 'Token inválido ou ausente' })
    return null
  }
  return user
}
