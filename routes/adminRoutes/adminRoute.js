import express from "express"
import { adminLogin } from "../../controller/adminController/adminController.js"
import { getAllusers,toggleBlockUser } from "../../controller/adminController/userController.js"
import { getAllOrders,updateOrderStatus } from "../../controller/adminController/orderController.js"
import { getAllproducts,createProduct,deleteProduct,updateProduct } from "../../controller/adminController/productController.js"
import { protect,adminOnly } from "../../middleware/authMiddleware.js"
import { getAdminDashboard } from "../../controller/adminController/adminDashboard.js"


const router=express.Router()

router.post("/adminlogin", adminLogin);
router.get("/users", protect, adminOnly, getAllusers)
router.patch("/users/:id", protect, adminOnly, toggleBlockUser)
router.get("/orders", protect, adminOnly, getAllOrders)
router.patch("/orders/:id", protect, adminOnly, updateOrderStatus)

router.get("/dashboard", protect, adminOnly, getAdminDashboard)
router.get("/products", protect, adminOnly, getAllproducts)
router.delete('/products/:id', protect, adminOnly, deleteProduct)

export default router