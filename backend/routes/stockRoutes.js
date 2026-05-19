const express = require("express");
const { getStockQuote, getBatchStocks } = require("../controllers/stockController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // Optional: protect stock endpoints to prevent abuse

router.get("/:symbol", getStockQuote);
router.post("/batch", getBatchStocks);

module.exports = router;
