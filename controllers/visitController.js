const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const chooseColor = require("../utils/chooseColor")
const { Op } = require("sequelize")
const mapCarPlate = require("./../utils/mapCarPlate")
const Car = db.car
const Visit = db.visit
const sequelize = db.sequelize

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

exports.addVisit = catchAsync(async (req, res, next) => {
  const plateNum = req.body.plateNum
  if (!plateNum) {
    return next(new AppError("please provide a plate number!", 400))
  }
  //check if the car already in
  const carIn = await Visit.findOne({
    where: { carPlateNum: plateNum, timeIn: { [Op.not]: null }, timeOut: null },
  })
  if (carIn) {
    return next(new AppError("car already in!", 400))
  }
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

  const { timeIn, section } = req.body
  const visit = await Visit.create({
    timeIn,
    section,
    carPlateNum: car.plateNum,
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
  if (!plateNum) {
    return next(new AppError("please provide a plate number!", 400))
  }
  // mapCarPlate.convert(plateNum)
  //check if the car already in
  const carIn = await Visit.findOne({
    where: { carPlateNum: plateNum, timeIn: { [Op.not]: null }, timeOut: null },
  })
  if (carIn) {
    return next(new AppError("car already in!", 400))
  }
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
    carPlateNum: car.plateNum,
  })
  if (!visit) return next(new AppError("Cant create visit!", 400))
  res.status(201).json({ status: "success", data: visit })
})

exports.visitCarOut = catchAsync(async (req, res, next) => {
  // Since it is out there must be a saved visit in database
  const plateNum = req.body.plateNum
  if (!plateNum) {
    return next(new AppError("please provide a plate number!", 400))
  }
  const car = await Car.findByPk(req.body.plateNum)
  if (!car) return next(new AppError("There are no record for this car", 404))

  // Update the timeout of the visit
  let updatedVisit = await Visit.findOne({
    where: {
      carPlateNum: car.plateNum,
      timeIn: { [Op.not]: null },
      timeOut: null,
    },
  })
  if (!updatedVisit) return next(new AppError("Car never been in!"))
  updatedVisit.timeOut = req.body.timeOut

  // to save timeout and convert it to date
  updatedVisit = await updatedVisit.save()

  // Calculate the cost of this by convert ms to hours multiply by the = every hour * 10 pound
  const cost =
    ((updatedVisit.timeOut - updatedVisit.timeIn) / (1000 * 60 * 60)) * 10

  updatedVisit.cost = cost

  updatedVisit = await updatedVisit.save()
  if (!updatedVisit)
    return next(new AppError("tThere are something wrong happen!"))
  // Send response
  res.status(200).json({ status: "success", data: updatedVisit })
})

exports.deleteCarVisits = async (req, res, next) => {
  await Visit.destroy({ where: { carPlateNum: req.params.plateNum } })
  console.log(req.params.plateNum)
  res.status(204).json({ status: "success", data: null })
}

exports.getVisitByCar = catchAsync(async (req, res, next) => {
  const { plateNum } = req.params
  const carVisit = await Visit.findOne({
    where: { carPlateNum: plateNum, timeIn: { [Op.not]: null }, timeOut: null },
  })
  if (!carVisit)
    return next(
      new AppError(
        "Cant get visit by car something wrong happened!\n Are you sure it in our garage?",
        400
      )
    )
  // cost  = every hour * 10 pound
  const cost = ((Date.now() - carVisit.timeIn) / (1000 * 60 * 60)) * 10
  carVisit.cost = cost
  res.status(200).json({ status: "success", data: carVisit })
})
exports.getAllCarVisit = catchAsync(async (req, res, next) => {
  const { plateNum } = req.params
  const carVisits = await Visit.findAll({
    where: { carPlateNum: plateNum },
  })
  if (!carVisits)
    return next(
      new AppError("Cant get visits by car something wrong happened!", 400)
    )
  res.status(200).json({ status: "success", data: carVisits })
})

exports.getVisitById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new AppError("can't find params id", 400))
  const visit = await Visit.findByPk(id)
  if (!visit) {
    return next(
      new AppError("Cant get visits by car something wrong happened", 500)
    )
  }
  res.status(200).json({ status: "success", data: visit })
})

exports.deleteVisitById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new AppError("can't find params id", 400))
  const visit = await Visit.findByPk(id)
  if (!visit) return next(new AppError("can't find visit with this id", 404))
  await visit.destroy()
  res.status(204).json({ status: "success", data: [] })
})

exports.updateVisitById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new AppError("can't find params id", 400))
  // Filter the wanted fields only
  const filteredBody = filterObj(req.body, "section", "cost")

  // Update function return array contain numbers of effected records and the returning
  // option to return the updated record
  const updatedVisit = await Visit.update(filteredBody, {
    where: { id },
    returning: true,
  })
  // Return the updated record
  res.status(200).json({ status: "success", data: updatedVisit[1] })
})

exports.getSectionCapacity = catchAsync(async (req, res, next) => {
  // find all cars that get in and never out
  const visits = await Visit.findAll({
    attributes: [
      "section",
      [sequelize.fn("COUNT", sequelize.col("id")), "cars"],
    ],
    group: ["section"],
    where: { timeIn: { [Op.not]: null }, timeOut: null },
  })
  if (!visits) return next(new AppError("can't get sections", 500))
  res.status(200).json({ status: "success", data: visits })
})
