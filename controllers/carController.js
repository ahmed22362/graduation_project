const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const color = require("./../utils/chooseColor")
const factory = require("./factoryHandler")
const Car = db.car

exports.setIdPlateNum = (req, res, next) => {
  req.params.id = req.params.plateNum
  next()
}
exports.setColor = (req, res, next) => {
  req.body.color = color
  next()
}
exports.getCars = factory.getAll(Car, ["color", "plateNum"])
exports.getCar = factory.getOne(Car)
exports.addCar = factory.createOne(Car)
exports.updateCar = factory.updateOne(Car)
exports.deleteCar = factory.deleteOne(Car)
