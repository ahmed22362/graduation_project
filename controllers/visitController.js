const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const chooseColor = require("../utils/chooseColor")

const Car = db.car
const Visit = db.visit

exports.addVisit = catchAsync(async (req, res, next) => {
  const plateNum = req.body.plateNum
  const [car, created] = await Car.findOrCreate({
    where: {
      plateNum: plateNum,
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
  const { timeIn, section, timeOut, cost } = req.body
  const visit = await Visit.create({
    timeIn,
    section,
    cost,
    CarPlateNum: car.plateNum,
  })
  if (!visit) return next(new AppError("Cant create visit!", 400))
  res.status(201).json({ status: "success", data: visit })
})

exports.getAllVisits = catchAsync(async (req, res, next) => {
  const visits = await Visit.findAll()
  if (!visits) return next(new AppError("Can't find visits", 400))
  res.status(200).json({ status: "success", data: visits })
})

exports.visitCarIn = catchAsync(async (req, res, next) => {
  const plateNum = req.body.plateNum
  // Check if the car exit or it first time
  const [car, created] = await Car.findOrCreate({
    where: {
      plateNum,
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
  // Create a new visit to this car
  const { timeIn, section } = req.body
  const visit = await Visit.create({
    timeIn: timeIn,
    section: section,
    CarPlateNum: car.plateNum,
  })
  if (!visit) return next(new AppError("Cant create visit!", 400))
  res.status(201).json({ status: "success", data: visit })
})

exports.visitCarOut = catchAsync(async (req, res, next) => {
  // Since it is out there must be a saved visit in database
  const car = await Car.findByPk(req.body.plateNum)
  if (!car)
    return next(new AppError("There are no visit record for this car", 404))
  // Update the timeout of the visit
  let updatedVisit = await Visit.findOne({
    where: { CarPlateNum: car.plateNum, timeOut: null },
  })
  if (!updatedVisit) return next(new AppError("Car never been in!"))
  updatedVisit.timeOut = req.body.timeOut

  // Calculate the cost of this by convert ms to hours multiply by the cost of that is .9$
  const cost =
    ((req.body.timeOut - updatedVisit.timeIn) / (1000 * 60 * 60)) * 0.9
  console.log(new Date(req.body.timeOut).getTime(), cost)
  updatedVisit.cost = cost

  updatedVisit = await updatedVisit.save()
  if (!updatedVisit)
    return next(new AppError("tThere are something wrong happen!"))
  // Send response
  res.status(200).json({ status: "success", data: updatedVisit })
})

exports.deleteVisits = async (req, res, next) => {
  await Visit.destroy({ where: { CarPlateNum: req.params.plateNum } })
  console.log(req.params.plateNum)
  res.status(204).json({ status: "success", data: null })
}
