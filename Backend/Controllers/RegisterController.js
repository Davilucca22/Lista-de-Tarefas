import { Userr } from "../model/modelUser.js"
import  argon2 from "argon2"
import jwt from 'jsonwebtoken'

export const Register = async (req,res) => {
    //const {form} = req.body

    const form = { //modelo dos dados que virao do front
        name: 'Admin',
        email:'Admin@gmail.com',
        password:'123456'
    }

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
