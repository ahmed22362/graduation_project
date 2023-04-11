const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const User = db.user
const Car = db.car
const Shop = db.shop
const UserVisit = db.user_shop

// Function to filter body for only wanted params
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
  res.status(404).end("this router is not exist")
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
  const filteredBody = filterObj(req.body, "name", "email", "imageURL")

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
exports.updateUserById = catchAsync(async (req, res, next) => {
  // Filter the wanted fields only
  const filteredBody = filterObj(req.body, "name", "email")

  // Update function return array contain numbers of effected records and the returning
  // option to return the updated record
  const updatedUser = await User.update(filteredBody, {
    where: { id: req.params.id },
    returning: true,
  })

  // Return the updated record
  res.status(200).json({ status: "success", data: updatedUser[1] })
})
exports.deleteUserById = catchAsync(async (req, res) => {
  const id = req.params.id
  await User.destroy({ where: { id } })
  res.status(200).json({ status: "success", data: null })
})

exports.addToUserVisit = catchAsync(async (req, res, next) => {
  // Find the user and the shop
  const user = req.user
  const shopId = req.body.shopId
  const shop = await Shop.findByPk(shopId)
  if (!shop) return next(new AppError("please provide valid shop id", 404))
  // Add the shop to selected user
  await user.addShop(shopId)

  res.status(200).json({ status: "success" })
})

exports.removeFromUserVisit = catchAsync(async (req, res, next) => {
  const user = req.user
  const shopId = req.body.shopId

  const shop = await Shop.findByPk(shopId)
  if (!shop) return next(new AppError("please provide valid shop id", 404))

  // Add the shop to selected user
  await user.removeShop(shopId)

  res.status(200).json({ status: "success" })
})

exports.getUserVisit = catchAsync(async (req, res, next) => {
  const userId = req.user.id
  // find the user include the shop
  const userVisit = await User.findByPk(userId, {
    include: ["shop"],
  })
  if (!userVisit) return next(new AppError("can't get visits", 404))
  // Select only shop
  const { shop } = userVisit
  res.status(200).json({ status: "success", data: shop })
})
