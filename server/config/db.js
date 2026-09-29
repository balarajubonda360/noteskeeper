import mongoose from "mongoose";

/** Connect to the MongoDB database configured in the environment. */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch {
    process.stderr.write("MongoDB connection failed. Check MONGO_URI and database availability.\n");
    process.exit(1);
  }
};
