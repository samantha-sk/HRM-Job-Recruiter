import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(error.message);
    });
};
export default connectDB;
