import { getCart, updateCartQuantity, removeCart, addTocart } from "../controller/CartController.js";
import express from 'express'
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/", protect, addTocart)
router.get("/", protect, getCart)
router.patch("/", protect, updateCartQuantity)
router.delete("/", protect, removeCart)

export default router