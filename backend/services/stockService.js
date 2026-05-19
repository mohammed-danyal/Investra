const axios = require("axios");

// Simple in-memory cache for stock quotes to prevent rate limits
const stockCache = {};
const CACHE_TTL = 60 * 1000; // 60 seconds

const fetchQuote = async (symbol) => {
  const now = Date.now();
  if (stockCache[symbol] && (now - stockCache[symbol].timestamp < CACHE_TTL)) {
    return stockCache[symbol].data;
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY || "demo";
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const response = await axios.get(url, { timeout: 8000 });
    const quote = response.data["Global Quote"];
    
    let result = null;
    if (quote && quote["05. price"]) {
      result = {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: quote["10. change percent"],
        volume: quote["06. volume"],
        high: parseFloat(quote["03. high"]),
        low: parseFloat(quote["04. low"]),
        open: parseFloat(quote["02. open"]),
        prevClose: parseFloat(quote["08. previous close"]),
      };
      
      // Cache the result
      stockCache[symbol] = {
        timestamp: now,
        data: result
      };
    } else {
      // API limit reached or invalid symbol
      result = stockCache[symbol] ? stockCache[symbol].data : {
        symbol,
        price: null,
        change: null,
        changePercent: null,
        note: "API limit reached or symbol not found."
      };
    }
    return result;
  } catch (error) {
    console.error(`Failed to fetch stock data for ${symbol}:`, error.message);
    return stockCache[symbol] ? stockCache[symbol].data : { symbol, error: "Failed to fetch" };
  }
};

const getBatchQuotes = async (symbols) => {
  if (!symbols || !Array.isArray(symbols)) {
    throw new Error("symbols array required");
  }
  
  // Use Promise.all for concurrent requests instead of sequential
  const promises = symbols.map(symbol => fetchQuote(symbol));
  const resultsArray = await Promise.all(promises);
  
  const resultsMap = {};
  resultsArray.forEach((res) => {
    if (res && res.symbol) {
      resultsMap[res.symbol] = res;
    }
  });
  
  return resultsMap;
};

module.exports = { fetchQuote, getBatchQuotes };
