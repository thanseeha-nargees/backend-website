import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const admin = await User.findOne({
            email,
            role: "admin",
            isDeleted: false
        }).select("+password")

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Not authorized as admin"
            })
        }

        const adminCheckPassword = await bcrypt.compare(password, admin.password)

        if (!adminCheckPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '14d' })

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
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            }
        });
    } catch (error) {
        console.log(error, "login error")
        res.status(500).json({ message: error.message })
    }

}