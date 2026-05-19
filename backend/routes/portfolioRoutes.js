const express = require("express");
const {
  getHoldings,
  getPositions,
  getOrders,
  createOrder,
  deleteHolding,
  deleteOrder,
  getFunds,
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all portfolio routes
router.use(protect);

router.get("/holdings", getHoldings);
router.delete("/holding/:id", deleteHolding);

router.get("/positions", getPositions);

router.get("/orders", getOrders);
router.post("/newOrder", createOrder);
router.delete("/order/:id", deleteOrder);
router.get("/funds", getFunds);

module.exports = router;
