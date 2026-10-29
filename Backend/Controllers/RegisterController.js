import { Userr } from "../model/models.js"
import  argon2 from "argon2"
import { createAuthToken, findUserByEmail, isInitialManagerEmail, normalizeEmail } from '../services/auth.js'

export const Register = async (req,res) => {
    const { form } = req.body

    if (!form?.name || !form?.email || !form?.password)
        return res.status(400).json({ msg: "Campos obrigatórios: name, email, password" })

    const email = normalizeEmail(form.email)
    if (isInitialManagerEmail(email)) {
        return res.status(403).json({ msg: 'A conta gestora inicial deve ser provisionada pelo administrador.' })
    }

    const searchUser = await findUserByEmail(email)

    if(searchUser) return res.json({msg:"Email ja Cadastrado!"})

    const HashPassword =  await argon2.hash(form.password) //criptografa a senha

    const newUSer = await Userr.create({ // criando novo usuario no banco
        NAME:form.name,
        EMAIL:email,
        PASSWORD:HashPassword
    })

    const token = createAuthToken(newUSer)

    res.json({msg:"Seja Bem Vindo!",token})

}
