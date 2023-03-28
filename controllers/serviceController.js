const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")
const filterObj = require("../utils/filterObj")
// const filterObj = require("../utils/filterObj")
const Service = db.service
const Offer = db.offer

// To get all service also query based on name and id if exist
exports.getAllService = catchAsync(async (req, res, next) => {
  // Define empty where object
  let whereObj = {}
  // Define allowed query
  const filteredQuery = filterObj(
    req.query,
    "id",
    "name",
    "location",
    "serviceTypeId",
    "openAt"
  )
  // op.or make problem if the filtered query is empty it return nothing
  // So i first checked if the query empty or not and then assign the value to the where object
  if (Object.entries(filteredQuery).length > 0) {
    whereObj = { [Op.or]: filteredQuery }
  }
  // if the where object is empty it return every thing
  const services = await Service.findAll({
    where: whereObj,
  })
  if (!services) {
    return next(new AppError("Error During getting services!", 500))
  }
  res.status(200).json({ status: "success", data: services })
})

exports.getServicesById = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id)
  if (!service) {
    return next(new AppError("can't find service", 500))
  }
  res.status(200).json({ status: "success", data: service })
})

exports.addService = catchAsync(async (req, res, next) => {
  console.log("here")
  const imageUrl = req.file ? req.file.path : null
  const { name, location, openAt, closeAt, phone, serviceTypeId, offerId } =
    req.body
  const service = await Service.create({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    serviceTypeId,
    offerId,
  })
  if (!service) return next(new AppError("Can't add service!", 500))
  res.status(200).json({ status: "success", data: service })
})

exports.updateService = catchAsync(async (req, res, next) => {
  // find the wanted service
  const id = req.params.id
  const service = await Service.findByPk(id)
  if (!service)
    return next(new AppError("can't find service with this id", 404))
  const imageUrl = req.file ? req.file.path : null

  const { name, location, openAt, closeAt, phone, serviceTypeId, offerId } =
    req.body
  // save Change on service
  await service.update({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    serviceTypeId,
    offerId,
  })
  // send result
  res.status(200).json({ status: "success", data: service })
})

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id)
  if (!service)
    return next(new AppError("Can't find service with this id", 404))
  await service.destroy()
  res.status(200).json({ status: "success", data: null })
})
