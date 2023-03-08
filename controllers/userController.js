const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const User = db.user
const Role = db.role

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]
    }
  })
  return newObj
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
  const image = req.file ? req.file.name : null

  // Check if the user input password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("To update your password use updateMyPassword route", 400)
    )
  }
  // Filter the wanted fields only
  const filteredBody = filterObj(req.body, "name", "email")

  // Update function return array contain numbers of effected records and the returning
  // option to return the updated record
  const updatedUser = await User.update(filteredBody, {
    where: { id: req.user.id },
    returning: true,
  })

  // Return the updated record
  res.status(200).json({ status: "success", data: updatedUser[1] })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.destroy({ where: { id: req.user.id } })
  res.status(204).json({ status: "success", data: null })
})

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return next(new AppError("no user found with this ID", 404))
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
