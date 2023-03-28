const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const User = db.user
const Car = db.car
const Service = db.service
const UserVisit = db.user_service

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
exports.userAddCar = catchAsync(async (req, res, next) => {
  const { plateNum } = req.body
  const userId = req.user.id
  // Find the wanted car
  let car = await Car.findByPk(plateNum)
  car.UserId = userId
  // Save the change in db
  await car.save()
  console.log(car)
  if (!car) return next(new AppError("Can't find the car!", 404))
  // Find user to return data with include the cars
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: "cars",
  })
  res.status(200).json({ status: "success", date: user })
})

exports.addToUserVisit = catchAsync(async (req, res, next) => {
  // Find the user and the service
  const user = await User.findByPk(req.user.id)
  const serviceId = req.body.serviceId

  if (!serviceId) return next(new AppError("please provide service id", 404))

  if (!user) return next(new AppError("please provide valid user id", 404))
  // Add the service to selected user
  await user.addService(serviceId)

  res.status(200).json({ status: "success", data: {} })
})

exports.removeFromUserVisit = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id)
  const serviceId = req.body.serviceId

  if (!serviceId) return next(new AppError("please provide service id", 404))
  if (!user) return next(new AppError("please provide user id", 404))

  // Add the service to selected user
  await user.removeService(serviceId)

  res.status(200).json({ status: "success", data: {} })
})

exports.getUserVisit = catchAsync(async (req, res, next) => {
  const userId = req.user.id
  // find the user include the service
  const userVisit = await User.findByPk(userId, {
    include: ["service"],
  })
  if (!userVisit) return next(new AppError("can't get visits", 404))
  // Select only service
  const service = JSON.parse(JSON.stringify(userVisit)).service
  res.status(200).json({ status: "success", data: service })
})
