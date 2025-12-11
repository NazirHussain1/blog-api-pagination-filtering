import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection.asPromise();
    return mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("MongoDB error:", error);
  }
};
