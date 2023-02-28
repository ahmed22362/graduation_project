const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const chooseColor = require("../utils/chooseColor")

const Car = db.car
const Visit = db.visit

exports.addVisit = catchAsync(async (req, res, next) => {
  const [car, created] = await Car.findOrCreate({
    where: {
      plateNum: req.body.plateNum,
    },
  })
  if (created) {
    car.color = chooseColor
    await car.save()
  }
  if (!car)
    return next(
      new AppError(
        "There is problem finding the car please enter a valid plate num!"
      )
    )
  const { timeIn, timeOut, section, cost, plateNum } = req.body
  const visit = await Visit.create({
    timeIn,
    timeOut,
    section,
    cost,
    CarPlateNum: plateNum,
  })
  if (!visit) return next(new AppError("Cant create visit!", 400))
  res.status(201).json({ status: "success", data: visit })
})

exports.getAllVisits = catchAsync(async (req, res, next) => {
  const visits = await Visit.findAll()
  if (!visits) return next(new AppError("Can't find visits", 400))
  res.status(200).json({ status: "success", data: visits })
})
