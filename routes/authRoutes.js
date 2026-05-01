import { registerSchema,loginSchema } from "../validation/authValidation.js";
import express, { Router } from "express";
import { registerUser,loginUser,logout } from "../controller/authController.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router()
router.post("/register",validate(registerSchema),registerUser)
router.post("/login",validate(loginSchema),loginUser)
router.post("/logout",logout)

export default router
