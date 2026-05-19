require("dotenv").config();

const validateEnv = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

async function startServer() {
  try {
    validateEnv();

    await connectDB();

    const PORT = process.env.PORT || 3002;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup Error:", error);
    process.exit(1);
  }
}

startServer();
