const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const Car = db.car

exports.getCars = catchAsync(async (req, res, next) => {
  const cars = await Car.findAll()
  res.status(200).json({
    status: "success",
    cars,
  })
})

exports.addCar = catchAsync(async (req, res, next) => {
  const { plateNum, color } = req.body
  const newCar = await Car.create({ plateNum, color })
  if (!newCar) {
    next(new AppError("Can't add car there are something wrong happened!"))
  }
  res.status(201).json({ status: "success", data: newCar })
})

exports.getCar = catchAsync(async (req, res, next) => {
  const { plateNum } = req.params
  const car = await Car.findByPk(plateNum)
  if (!car) {
    return next(new AppError("Cant find the car!", 404))
  }
  res.status(200).json({ status: "success", data: car })
})
