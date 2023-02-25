const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const User = db.user
const Role = db.role

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll()
  res.status(200).json({ users })
})
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
}
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
}
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
}
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  })
}
