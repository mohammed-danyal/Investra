const portfolioService = require("../services/portfolioService");
const asyncHandler = require("../utils/asyncHandler");

const getHoldings = asyncHandler(async (req, res) => {
  const holdings = await portfolioService.getHoldings(req.user.id);
  res.json({ success: true, data: holdings });
});

const getPositions = asyncHandler(async (req, res) => {
  const positions = await portfolioService.getPositions(req.user.id);
  res.json({ success: true, data: positions });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await portfolioService.getOrders(req.user.id);
  res.json({ success: true, data: orders });
});

const createOrder = asyncHandler(async (req, res) => {
  const newOrder = await portfolioService.createOrder(req.user.id, req.body);
  res.status(201).json({ success: true, data: newOrder, message: "Order saved!" });
});

const deleteHolding = asyncHandler(async (req, res) => {
  await portfolioService.deleteHolding(req.user.id, req.params.id);
  res.json({ success: true, message: "Holding deleted", data: { id: req.params.id } });
});

const deleteOrder = asyncHandler(async (req, res) => {
  await portfolioService.deleteOrder(req.user.id, req.params.id);
  res.json({ success: true, message: "Order deleted", data: { id: req.params.id } });
});

const getFunds = asyncHandler(async (req, res) => {
  const funds = await portfolioService.getFunds(req.user.id);
  res.json({ success: true, data: funds });
});

module.exports = {
  getHoldings,
  getPositions,
  getOrders,
  createOrder,
  deleteHolding,
  deleteOrder,
  getFunds,
};
