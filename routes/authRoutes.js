import { registerSchema,loginSchema } from "../validation/authValidation";
import express, { Router } from "express";
import { registerUser,loginUser,logout } from "../controller/authController";
import {validate} from "../middleware/validateMiddleware.js";

const router = express.Router()
router.post("/register")