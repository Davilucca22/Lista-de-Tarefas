import { CreateTeam, GetTeam } from '../Backend/Controllers/TeamController.js'
import { withDatabase } from '../Backend/services/serverless.js'

export default async function handler(req, res) {
  if (req.method === 'GET') return withDatabase(GetTeam, { protectedRoute: true })(req, res)
  if (req.method === 'POST') return withDatabase(CreateTeam, { protectedRoute: true })(req, res)
  return res.status(405).json({ msg: 'Método não permitido.' })
}
