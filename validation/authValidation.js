import Joi from "joi";

export const registerSchema=Joi.object({
    username: Joi.string().trim().required().min(3).max(16),
    email: Joi.string().required().trim().lowercase().email(),
    password: Joi.string().trim().required().min(6)
})

export const loginSchema=Joi.object({
    email:Joi.string().required().trim().lowercase().email(),
    password:Joi.string().trim().required().min(6)
})