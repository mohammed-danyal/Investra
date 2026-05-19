const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: String,
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

PositionsSchema.index({ user: 1 });
PositionsSchema.index({ name: 1 });

module.exports = { PositionsSchema };