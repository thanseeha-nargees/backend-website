import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const checkUser = await User.findOne({ email })

        if (checkUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashed
        })

        res.status(201).json({
            message: "user created",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '14d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error, "login error")
        res.status(500).json({ message: error.message })
    }
}


export const logout = (req, res) => {

    res.cookie("token", "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        expires: new Date(0),
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};