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
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`API listening at http://localhost:${port}`);
  });
  server.on("error", (error) => {
    console.error(`API failed to listen on port ${port}: ${error.message}`);
    process.exitCode = 1;
  });
};

startServer().catch((error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});
