require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

if (uri) {
  mongoose.connect(uri)
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => console.error("DB connection error:", err.message));
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("App started on port " + PORT);
  });
}

module.exports = app;
