import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";                                                                    

dotenv.config();
connectDb();
const app = express()
app.use(cookieParser())
app.use(express.json())

const PORT =process.env.PORT

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
