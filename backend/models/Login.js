// models/Login.js
const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    default: "",
  },
  userAgent: {
    type: String,
    default: "",
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginLog", loginSchema);
