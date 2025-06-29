import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/test`);
        console.log("Database connected successfully");
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Optional: Exit process on failure
    }
}     
      

export default connectDB;




















