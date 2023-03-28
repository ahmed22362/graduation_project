const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const User = db.user

exports.addToCheckout = catchAsync(async (req, res, next) => {
  res.status(501).json({ status: "not done yet" })
})
