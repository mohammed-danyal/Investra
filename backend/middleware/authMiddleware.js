const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await UserModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
});

module.exports = { protect };
