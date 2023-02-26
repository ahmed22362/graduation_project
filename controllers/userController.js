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
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return next(new AppError("no tour found with this ID", 404))
  }
  res.status(200).json({
    status: "success",
    message: user,
  })
})
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
