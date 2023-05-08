const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const factory = require("./factoryHandler")
const authController = require("./authController")
const User = db.user
const Shop = db.shop

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

exports.updateMe = catchAsync(async (req, res, next) => {
  const image = req.file ? req.file.name : null
  // Check if the user input password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("To update your password use updateMyPassword route", 400)
    )
  }
  req.body.imageUrl = image
  // Filter the wanted fields only
  const filteredBody = filterObj(req.body, "name", "email", "imageUrl")
  // Update function return array contain numbers of effected records and the returning
  // option to return the updated record
  const updatedUser = await User.update(filteredBody, {
    where: { id: req.user.id },
    returning: true,
  })
  // Return the updated record
  res.status(200).json({ status: "success", data: updatedUser[1] })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}
exports.getUser = factory.getOne(User)
exports.updateUserById = factory.updateOne(User)
exports.deleteUserById = factory.deleteOne(User)
exports.getAllUsers = factory.getAll(User)
exports.createUser = factory.createOne(User)

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

exports.signUpUser = authController.signup(User)
exports.logInUser = authController.login(User)
exports.forgetPasswordUser = authController.forgetPassword(User)
exports.resetPasswordUser = authController.resetPassword(User)
exports.protectUser = authController.protect(User)
exports.updateMyPasswordUser = authController.updateUserPassword(User)
