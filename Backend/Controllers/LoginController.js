import argon2 from 'argon2'
import { applyInitialManagerRole, createAuthToken, findUserByEmail } from '../services/auth.js'

export const Login = async (req,res) => {
    const { form } = req.body

    if (!form?.email || !form?.password)
        return res.status(400).json({ msg: "Campos obrigatórios: email, password" })

    const users = await findUserByEmail(form.email)

    if(!users) return res.json({msg:"Usuario não Encontrado"})

    const compPass = await argon2.verify(users.PASSWORD,form.password) // compara a senha do banco com a enviada pelo usuario

    if(!compPass) return res.json({msg:"Senha Incorreta!"})

    applyInitialManagerRole(users)
    await users.save()
    const token = createAuthToken(users)
    
    res.json({msg:"Login Realizado!",token})

}
