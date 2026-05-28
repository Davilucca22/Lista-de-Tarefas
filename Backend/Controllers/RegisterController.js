import { Userr } from "../model/models.js"
import  argon2 from "argon2"
import jwt from 'jsonwebtoken'

export const Register = async (req,res) => {
    const { form } = req.body

    if (!form?.name || !form?.email || !form?.password)
        return res.status(400).json({ msg: "Campos obrigatórios: name, email, password" })

    const searchUser = await Userr.findOne({EMAIL:form.email}) //busca pelo email

    if(searchUser) return res.json({msg:"Email ja Cadastrado!"})

    const HashPassword =  await argon2.hash(form.password) //criptografa a senha

    const newUSer = await Userr.create({ // criando novo usuario no banco
        NAME:form.name,
        EMAIL:form.email,
        PASSWORD:HashPassword
    })

    const token = jwt.sign({id:newUSer._id, NAME:form.name},globalThis.process?.env.JWT_SECRET,{expiresIn:'14d'})

    res.json({msg:"Seja Bem Vindo!",token})

}
