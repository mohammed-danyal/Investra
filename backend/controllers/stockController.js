const stockService = require("../services/stockService");
const asyncHandler = require("../utils/asyncHandler");

const getStockQuote = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const data = await stockService.fetchQuote(symbol);
  if (data.error) {
    return res.status(502).json({ success: false, error: data.error, symbol });
  }
  res.json({ success: true, data });
});

const getBatchStocks = asyncHandler(async (req, res) => {
  const { symbols } = req.body;
  const data = await stockService.getBatchQuotes(symbols);
  res.json({ success: true, data });
});

module.exports = { getStockQuote, getBatchStocks };
