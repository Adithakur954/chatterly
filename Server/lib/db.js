import mongoose from "mongoose";

// function to mongodb

export const connectDB = async () =>{
    try {
        mongoose.connection.on("connected", () =>console.log('MongoDB connected successfully')); //connected is an event and method to print that data basse is connected
        await mongoose.connect(`${process.env.MONGODB_URI}/chatterly`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);   
    }
}