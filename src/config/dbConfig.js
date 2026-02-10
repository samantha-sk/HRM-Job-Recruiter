import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

 const connectDb = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI); 
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected on host ${connect.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection failed`);
    process.exit(1);
  }
};
export default connectDb;