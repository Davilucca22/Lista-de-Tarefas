import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next) => {
    const token = req.header('Authorization')?.replace('Bearer ','')

    if(!token) return res.status(400).json({msg:"Token nao fornecido!"})

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(e){
        res.status(400).json({msg:"Token Invalido"})
    }
}