
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        const activeUsers = await User.countDocuments({
            role: "user",
            isDeleted: false,
            isBlocked: false,
        });

        const totalProducts = await Product.countDocuments({
            isDeleted: false,
        });

        const orders = await Order.countDocuments();
        const recentOrders = await Order.find()
            .populate("userId", "username email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            dashboard: {
                totalRevenue,
                activeUsers,
                totalProducts,
                orders,
                recentOrders,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
