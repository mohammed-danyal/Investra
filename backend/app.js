const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

// Trust proxy for Render deployment
app.set("trust proxy", 1);

// CORS Configuration with explicit origins
app.use(cors({
  origin: [
    "https://investra-nu.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));

// Handle preflight requests
app.options("*", cors());

app.use(express.json()); // body-parser is deprecated in Express v4.16+

// Health Check
app.get("/health", (req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/stock", stockRoutes);

// Error Middleware
app.use(errorHandler);

module.exports = app;
