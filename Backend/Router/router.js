import express from "express"

export const router = express.Router()

//valida o token na rota
import { verifyToken } from "../middlewares/authMiddleware.js" 

import { Register } from "../Controllers/RegisterController.js"
import { Login } from "../Controllers/LoginController.js"
import { CriaTarefa } from "../Controllers/CriaTarefa.js"
import {SearchList} from "../Controllers/BuscaTarefas.js"
import {EditList} from "../Controllers/EditaTarefa.js"
import { DeleteList } from "../Controllers/DeleteTarefas.js"


router.post('/register', Register)
router.post('/login', Login)
router.post('/add', verifyToken,CriaTarefa)
router.get('/list',verifyToken,SearchList)
router.put('/edit',verifyToken,EditList)
router.delete('/delete',verifyToken,DeleteList)