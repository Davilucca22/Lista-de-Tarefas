import { getAuthenticatedUser } from '../services/auth.js'

export const verifyToken = async (req, res, next) => {
    try {
        const user = await getAuthenticatedUser(req)
        if (!user) return res.status(401).json({ msg: 'Token inválido ou ausente' })
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}