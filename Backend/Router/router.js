import express from "express"

export const router = express.Router()

import { Register } from "../Controllers/RegisterController.js"
import { Login } from "../Controllers/LoginController.js"

router.post('/register', Register)
router.post('/login', Login)