const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const filterObj = require("../utils/filterObj")
const Service = db.service
const Offer = db.offer

// To get all service also query based on name and id if exist
exports.getAllService = catchAsync(async (req, res, next) => {
  // const { name, location, ServiceType } = req.query.name ? req.query.name : ""
  const filteredBody = filterObj(req.body, "name", "location")
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
  // Get the offer id and find the wanted offer
  const offerId = req.body.offerId
  const serviceTypeId = req.body.serviceTypeId ? req.body.serviceTypeId : null
  const name = req.body.name ? req.body.name : null
  service.offerId = offerId
  service.serviceTypeId = serviceTypeId
  // save Change on service
  await service.save()
  // send result
  res.status(200).json({ status: "success", data: service })
})
