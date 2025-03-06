import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connection is successful: ${conn.connection.host}`);}
        catch (err) {
            console.error("Mongo DB error",err);
        }
}