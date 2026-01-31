import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Database already connected");
    return;
  }

  try {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      heartbeatFrequencyMS: 10000,
      maxStalenessSeconds: 90
    };
    
    console.log("Connecting to MongoDB...");
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      isConnected = true;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    
  } catch (error) {
    console.error("Database connection error:", error);
    isConnected = false;
    throw new Error(`Database connection failed: ${error.message}`);
  }
};
