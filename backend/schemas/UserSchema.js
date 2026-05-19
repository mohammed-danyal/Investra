const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 100000 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { UserSchema };
