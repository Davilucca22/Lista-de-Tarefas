import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { router } from "./Router/router.js";

//import cors from 'cors'

const app = express();

/*app.use(cors({ //aceita requisiçoes apenas do endpoint passado
    origin: globalThis.process?.env?.FRONT_URI
}))*/

app.use(express.json()); // trata JSON
app.use(express.urlencoded({extended:true})) //trata Body

const MONGO_URI = globalThis.process?.env?.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow"; //link para conectar ao banco de dados

mongoose.connect(MONGO_URI).then(() => {
    try{
        app.emit("OK")
    }catch(err){
        console.log("ERRO AO CONECTAR AO BANCO DE DADOS")
        console.log(err)
    }
})

app.use(router)

const port = globalThis.process?.env?.PORT

app.on("OK",() =>{
    app.listen(port, () => {
        console.log(`Servidor Rodando em http://localhost:${port}`)
    })
})
