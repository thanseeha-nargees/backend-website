import User from "../../models/User.js";
import { pagination } from "../../utils/pagination.js";
import mongoose from "mongoose";

export const getAllusers = async (req, res) => {

    try {

        const { keyword } = req.query;
        
        const { page, limit, skip } = pagination(req.query);

        const filter = {
            isDeleted: false,
            role: "user"
        };

        if (keyword) {
            filter.$or = [
                { username: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ]
        }

        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit
            },
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}


export const toggleBlockUser = async (req, res) => {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }

        const user = await User.findOne({
            _id: id,
            role: "user",
            isDeleted: false
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isBlocked = !user.isBlocked;
        
        await user.save();

        res.status(200).json({
            success: true,
            message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}