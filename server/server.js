import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import seedQuotes from "./utils/seedQuotes.js";

const startServer = async () => {
  const requiredEnvironment = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
  const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
  if (missingEnvironment.length) {
    throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
  }
  await connectDB();
  await seedQuotes();
  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0");
};

startServer();
