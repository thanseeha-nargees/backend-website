import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req,res,next) => {
    try {
        const token = req.cookies?.token 

        if(!token){
            return res.status(401).json({message : "no token , no authorized"})
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET) 
        const user = await User.findById(decode.id).select("-password")

        if(!user){
           return res.status(401).json({message : "user not exists"})
        }
        
        req.user = user ; 
        next()
    
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export const adminOnly = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(401).json({ success: false, message: "only admin can accesses " })
    }
}