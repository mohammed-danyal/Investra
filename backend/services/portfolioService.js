const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { UserModel } = require("../model/UserModel");

const getHoldings = async (userId) => {
  return await HoldingsModel.find({ user: userId });
};

const getPositions = async (userId) => {
  return await PositionsModel.find({ user: userId });
};

const getOrders = async (userId) => {
  return await OrdersModel.find({ user: userId }).sort({ _id: -1 });
};

const createOrder = async (userId, orderData) => {
  const { name, qty, price, mode } = orderData;
  if (!name || !qty || !mode) {
    throw new Error("name, qty and mode are required");
  }

  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const numericQty = Number(qty);
  const numericPrice = Number(price) || 0;
  const orderCost = numericQty * numericPrice;

  if (mode === "BUY") {
    const currentBalance = user.balance !== undefined ? user.balance : 100000;
    if (currentBalance < orderCost) {
      throw new Error("Insufficient funds for this transaction");
    }

    user.balance = currentBalance - orderCost;

    // Update/Insert Holdings
    const existingHolding = await HoldingsModel.findOne({ user: userId, name });
    if (existingHolding) {
      const oldCost = existingHolding.qty * existingHolding.avg;
      const newQty = existingHolding.qty + numericQty;
      existingHolding.avg = (oldCost + orderCost) / newQty;
      existingHolding.qty = newQty;
      existingHolding.price = numericPrice;
      await existingHolding.save();
    } else {
      await new HoldingsModel({
        user: userId,
        name,
        qty: numericQty,
        avg: numericPrice,
        price: numericPrice,
        net: "0.00%",
        day: "0.00%",
      }).save();
    }

    // Update/Insert Positions
    const existingPosition = await PositionsModel.findOne({ user: userId, name });
    if (existingPosition) {
      const oldCost = existingPosition.qty * existingPosition.avg;
      const newQty = existingPosition.qty + numericQty;
      existingPosition.avg = (oldCost + orderCost) / newQty;
      existingPosition.qty = newQty;
      existingPosition.price = numericPrice;
      await existingPosition.save();
    } else {
      await new PositionsModel({
        user: userId,
        product: "CNC",
        name,
        qty: numericQty,
        avg: numericPrice,
        price: numericPrice,
        net: "0.00%",
        day: "0.00%",
        isLoss: false,
      }).save();
    }
  } else if (mode === "SELL") {
    const existingHolding = await HoldingsModel.findOne({ user: userId, name });
    if (!existingHolding || existingHolding.qty < numericQty) {
      throw new Error("Insufficient holdings to execute sell order");
    }

    const currentBalance = user.balance !== undefined ? user.balance : 100000;
    user.balance = currentBalance + orderCost;

    existingHolding.qty -= numericQty;
    if (existingHolding.qty === 0) {
      await HoldingsModel.deleteOne({ _id: existingHolding._id });
    } else {
      await existingHolding.save();
    }

    const existingPosition = await PositionsModel.findOne({ user: userId, name });
    if (existingPosition) {
      existingPosition.qty -= numericQty;
      if (existingPosition.qty <= 0) {
        await PositionsModel.deleteOne({ _id: existingPosition._id });
      } else {
        await existingPosition.save();
      }
    }
  }

  await user.save();

  const newOrder = new OrdersModel({ user: userId, name, qty: numericQty, price: numericPrice, mode });
  return await newOrder.save();
};

const deleteHolding = async (userId, holdingId) => {
  const deleted = await HoldingsModel.findOneAndDelete({ _id: holdingId, user: userId });
  if (!deleted) throw new Error("Holding not found or unauthorized");
  return deleted;
};

const deleteOrder = async (userId, orderId) => {
  const deleted = await OrdersModel.findOneAndDelete({ _id: orderId, user: userId });
  if (!deleted) throw new Error("Order not found or unauthorized");
  return deleted;
};

const getFunds = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const holdings = await HoldingsModel.find({ user: userId });
  const totalInvestment = holdings.reduce((sum, s) => sum + s.avg * s.qty, 0);

  return {
    balance: user.balance !== undefined ? user.balance : 100000,
    usedMargin: totalInvestment,
    availableMargin: user.balance !== undefined ? user.balance : 100000,
  };
};

module.exports = {
  getHoldings,
  getPositions,
  getOrders,
  createOrder,
  deleteHolding,
  deleteOrder,
  getFunds,
};
