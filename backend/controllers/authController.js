const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");
const asyncHandler = require("../utils/asyncHandler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("All fields are required.");
  }
  const existing = await UserModel.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Email already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ name, email, phone, password: hashedPassword });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id, email, name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ success: true, data: { token, name: newUser.name }, message: "Account created successfully!" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required.");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign({ id: user._id, email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ success: true, data: { token, name: user.name }, message: "Login successful!" });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, getMe };
