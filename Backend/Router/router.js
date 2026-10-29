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
import { CreateTeam, GetTeam, RespondToInvite, TeamDashboard, TeamInvites } from "../Controllers/TeamController.js"


router.post('/register', Register)
router.post('/login', Login)
router.post('/add', verifyToken,CriaTarefa)
router.get('/list',verifyToken,SearchList)
router.put('/edit',verifyToken,EditList)
router.delete('/delete',verifyToken,DeleteList)
router.get('/team', verifyToken, GetTeam)
router.post('/team', verifyToken, CreateTeam)
router.all('/team/invites', verifyToken, TeamInvites)
router.post('/team/invites/respond', verifyToken, RespondToInvite)
router.get('/team/dashboard', verifyToken, TeamDashboard)