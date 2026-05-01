import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const { address, payment } = req.body;

        const cartItems = await Cart.find({ userId }).populate("productId")

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "your cart is empty",
            })
        }


        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.productId.price * item.quantity
        }, 0)

        const products = cartItems.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));

        const order = await Order.create({
            userId,
            products,
            orderId: "ORD-" + Date.now(),
            totalPrice,
            paymentMethod: payment,
            shippingDetails: address,
            status: 'Processing',
        })

        await Cart.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: "Order placed successfully",
            order,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const order = await  Order.find({ userId }).sort({ createdAt: -1 }).populate("products.productId" ," image brand price name " );

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}