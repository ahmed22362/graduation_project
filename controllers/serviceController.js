const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const Service = db.service

exports.getAllService = catchAsync(async (req, res, next) => {
  const services = await Service.findAll()
  if (!services) {
    return next(new AppError("Error During getting services!", 500))
  }
  res.status(200).json({ status: "success", data: services })
})

exports.getServicesByName = catchAsync(async (req, res, next) => {
  const services = await Service.findAll({ where: { name: req.params.name } })
  if (!services) {
    return next(new AppError("something wrong while finding services!", 500))
  }
  res
    .status(200)
    .json({ status: "success", length: services.length, data: services })
})

exports.getServicesById = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id)
  if (!service) {
    return next(new AppError("can't find service", 500))
  }
  res.status(200).json({ status: "success", data: service })
})

exports.addService = catchAsync(async (req, res, next) => {
  const imageUrl = req.file ? req.file.path : null
  const { name, location, openAt, closeAt, phone, ServiceTypeId } = req.body
  const service = await Service.create({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    ServiceTypeId,
  })
  if (!service) return next(new AppError("Can't add service!", 500))
  res.status(200).json({ status: "success", data: service })
})
