import express from "express"

export const router = express.Router()

import { Register } from "../Controllers/RegisterController.js"
import { Login } from "../Controllers/LoginController.js"

router.post('/',Register)
router.get('/login',Login)