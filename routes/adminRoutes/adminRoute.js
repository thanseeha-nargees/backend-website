import express from "express"
import { adminLogin } from "../../controller/adminController/adminController.js"
import { getAllusers,toggleBlockUser } from "../../controller/adminController/userController.js"
import { getAllOrders,updateOrderStatus } from "../../controller/adminController/orderController.js"
import { getAllproducts,createProduct,deleteProduct,updateProduct } from "../../controller/adminController/productController.js"
import { protect,adminOnly } from "../../middleware/authMiddleware.js"
import { getAdminDashboard } from "../../controller/adminController/adminDashboard.js"
import uploadProduct from "../../middleware/uploadProduct.js"


const router=express.Router()

router.post("/adminlogin", adminLogin);
router.get("/users", protect, adminOnly, getAllusers)
router.patch("/users/:id", protect, adminOnly, toggleBlockUser)
router.get("/orders", protect, adminOnly, getAllOrders)
router.patch("/orders/:id", protect, adminOnly, updateOrderStatus)

router.get("/dashboard", protect, adminOnly, getAdminDashboard)
router.get("/products", protect, adminOnly, getAllproducts)
router.delete('/products/:id', protect, adminOnly, deleteProduct)
router.post ("/products",protect,adminOnly,uploadProduct.single("image"),createProduct);
router.put("/products/:id",protect,adminOnly,uploadProduct.single("image",updateProduct))

export default router