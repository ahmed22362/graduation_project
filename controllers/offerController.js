const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")
const Offer = db.offer
const Shop = db.shop
// Hot offers is the offers which the discount is more than 40
exports.getHotOffersServices = catchAsync(async (req, res, next) => {
  // Select only wanted offer with eager loading of shops
  const hotOffers = await Offer.findAll({
    where: { discount: { [Op.gte]: 40 } },
    include: "shop",
  })
  if (!hotOffers) return next(new AppError("Cant find hot offers", 500))

  res.status(200).json({ status: "success", data: hotOffers })
})

//Get All Offers include shops
exports.getAllOffersShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.findAll({ include: "offer" })
  if (!shops) return next(new AppError("Cant find offers", 404))
  const { d } = offers.map((el) => {
    return { discount: el.discount, shops: el.shop }
  })
  console.log(typeof offers)
  res.status(200).json({ status: "success", data: offers })
})

// Get all offers
exports.getAllOffers = catchAsync(async (req, res, next) => {
  const offers = await Offer.findAll()
  if (!offers) return next(new AppError("Cant find offers", 404))
  res.status(200).json({ status: "success", data: offers })
})

// Add new Offer
exports.addOffer = catchAsync(async (req, res, next) => {
  const { discount, startAt, endAt } = req.body
  const offer = await Offer.create({ discount, startAt, endAt })
  if (!offer) return next(new AppError("cant Create Offer", 400))
  res.status(201).json({ status: "success", data: offer })
})

// Get Offer by id
exports.getOfferById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const offer = await Offer.findByPk(id)
  if (!offer) return next(new AppError("Can't find offer with this id", 404))
  res.status(200).json({ status: "success", data: offer })
})

// Delete Offer by id
exports.deleteOffer = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const offer = await Offer.findByPk(id)
  if (!offer) return next(new AppError("Can't find offer with this id", 404))
  await offer.destroy()
  res.status(204).json({ status: "success", data: null })
})

// Update offer by id
exports.updateOffer = catchAsync(async (req, res, next) => {
  // find the offer
  const id = req.params.id
  const offer = await Offer.findByPk(id)
  if (!offer) return next(new AppError("can't find offer with this id", 404))
  // destruct the wanted data
  const { discount, startAt, endAt } = req.body
  // update
  const updatedOffer = await offer.update(
    { discount, startAt, endAt },
    {
      returning: true,
    }
  )
  res.status(200).json({ status: "success", data: updatedOffer })
})
