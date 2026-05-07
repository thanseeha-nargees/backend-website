import Product from "../../models/products.js";
import { pagination } from "../../utils/pagination.js"

export const getAllproducts = async (req, res) => {

    try {
        const { page, skip, limit } = pagination(req.query);

        const { keyword } = req.query;

        const filter = {
            isDeleted: false
        }

        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { brand: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
            ];
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

export const createProduct = async (req, res) => {
    try {
        const { brand, name, category, price, description } = req.body;
        
        if (!req.file?.path) {
            return res.status(400).json({
                success: false,
                message: "Product image is required",
            })
        }

        const product = await Product.create({
            brand,
            name,
            category,
            price,
            description,
            image: req.file.path
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        })

    } catch (error) {
        console.error("Create product error:", error.message)
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const { brand, name, category, price, description } = req.body;

        const updateData = {}

        if (brand) {
            updateData.brand = brand
        }
        if (name) {
            updateData.name = name
        }
        if (category) {
            updateData.category = category
        }
        if (price) {
            updateData.price = price
        }
       
        if (description) {
            updateData.description = description
        }
        if (req.file?.path) {
            updateData.image = req.file.path
        }

        const product = await Product.findByIdAndUpdate(productId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });

    }

}

export const deleteProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { isDeleted: true },
            { new: true },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};