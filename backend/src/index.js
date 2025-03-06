import express from "express";
import cookieParser from"cookie-parser";

import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT

const app = express()

import router from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";

app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", router)
app.use("/api/message", messageRoutes)

app.listen(PORT, ()=>{
    console.log('app is running on port no 5001 ')
    connectDB();
});