require("dotenv").config();
const validateEnv = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

// Validate Environment Variables
validateEnv();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
