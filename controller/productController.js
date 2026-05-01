import Product from "../models/Product.js";
import { pagination } from "../utils/pagination.js";

export const getAllProducts = async (req, res) => {
    try {
        const { page, limit, skip } = pagination(req.query)
        const { keyword, brand, category } = req.query

        const filter = { isDeleted: { $ne: true } }

        if (brand) {
            filter.brand = brand;
        }

        if (category) {
            filter.category = category;
        }

        if (keyword && keyword.trim()) {
            filter.$or = [
                { name: { $regex: keyword.trim(), $options: "i" } },
                { brand: { $regex: keyword.trim(), $options: "i" } },
                { category: { $regex: keyword.trim(), $options: "i" } }
            ]
        }

        const totalProducts = await Product.countDocuments(filter)
        const products = await Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                limit
            },
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isDeleted: { $ne: true }
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product not found"
            })
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}