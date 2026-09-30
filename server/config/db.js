import mongoose from "mongoose";

// import dotenv from 'dotenv'

// dotenv.config()
import "dotenv/config";

/** Connect to the MongoDB database configured in the environment. */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected${mongoose.connection.name ? ` to database "${mongoose.connection.name}"` : ""}.`);
  } catch (error) {
    const message = String(error?.message || error)
      .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, "<redacted MongoDB URI>");
    console.error(`MongoDB connection failed: ${message}`);
    throw error;
  }
};
