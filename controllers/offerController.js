const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")

const Service = db.service
const Offer = db.offer
// Hot offers is the offers which the discount is more than 40
exports.getHotOffersServices = catchAsync(async (req, res, next) => {
  // Select only wanted offer with eager loading of services
  const hotOffers = await Offer.findAll({
    where: { discount: { [Op.gte]: 40 } },
    include: "services",
  })
  if (!hotOffers) return next(new AppError("Cant find hot offers", 500))
  // Parse the object to select only the services
  const services = JSON.parse(JSON.stringify(hotOffers))[0].services
  res.status(200).json({ status: "success", data: services })
})
//Get All Offers include services
exports.getAllOffersServices = catchAsync(async (req, res, next) => {
  const offers = await Offer.findAll({ include: "services" })
  if (!offers) return next(new AppError("Cant find offers", 404))
  const services = JSON.parse(JSON.stringify(offers))[0].services
  res.status(200).json({ status: "success", data: services })
})
// Get all offers
exports.getAllOffers = catchAsync(async (req, res, next) => {
  const offers = await Offer.findAll()
  if (!offers) return next(new AppError("Cant find offers", 404))
  res.status(200).json({ status: "success", data: offers })
})

// Add new Offer
exports.addOffer = catchAsync(async (req, res, next) => {
  const { duration, discount } = req.body
  const offer = await Offer.create({ duration, discount })
  if (!offer) return next(new AppError("cant Create Offer", 400))
  res.status(201).json({ status: "success", data: offer })
})

// Get Offer by id
exports.getOfferById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const offer = await Offer.findByPk(id)
  if (!offer) return next(new AppError("cant find Offer", 404))
  res.status(201).json({ status: "success", data: offer })
})
// Delete Offer by id
exports.deleteOffer = catchAsync(async (req, res, next) => {
  const id = req.params.id
  await Offer.destroy({ where: { id } })
  res.status(204).json({ status: "success", data: null })
})
