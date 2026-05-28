import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { Userr } from "../model/models.js"

export const Login = async (req,res) => {
    const { form } = req.body

    if (!form?.email || !form?.password)
        return res.status(400).json({ msg: "Campos obrigatórios: email, password" })

    const users = await Userr.findOne({EMAIL:form.email}) // busca pelo email

    console.log(users)

    if(!users) return res.json({msg:"Usuario não Encontrado"})

    const compPass = await argon2.verify(users.PASSWORD,form.password) // compara a senha do banco com a enviada pelo usuario

    if(!compPass) return res.json({msg:"Senha Incorreta!"})

    const token = jwt.sign({id:users._id, NAME:users.name},globalThis.process?.env.JWT_SECRET,{expiresIn:'14d'})
    
    res.json({msg:"Login Realizado!",token})

}
