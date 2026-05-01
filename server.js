import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";                                                                    
import authRouter from "./routes/authRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import CartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"


dotenv.config();
connectDb();
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth/", authRouter)
app.use("/api/product",ProductRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/order",orderRoutes)

const PORT =process.env.PORT

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
