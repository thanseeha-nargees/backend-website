import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { placeOrder ,  getUserOrders} from "../controller/orderController.js"

const router = express.Router()

router.post("/" , protect , placeOrder)
router.get("/" , protect , getUserOrders )


export default router