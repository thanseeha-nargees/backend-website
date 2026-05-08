import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { pagination } from "../../utils/pagination.js";
import mongoose from "mongoose";


export const getAllOrders = async (req, res) => {
    try {
        const { page, limit, skip } = pagination(req.query);

        const filter = {};


        const totalOrders = await Order.countDocuments(filter);

        const orders = await Order.find(filter).populate("userId", "username email").sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: orders.length,
            pagination: {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: page,
                limit,
            },
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate("userId", "username email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

