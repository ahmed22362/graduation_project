const catchAsync = require("../utils/catchAsync")
const Offer = require("../models/modelTables/offerModel")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")

// Hot offers is the offers which the discount is more than 40
exports.getHotOffers = catchAsync(async (req, res, next) => {
  const hotOffers = Offer.find({ where: { discount: { [Op.gte]: 40 } } })
  if (!hotOffers) return next(new AppError("Cant find hot offers", 500))
  res.status(200).json({ status: "success", data: hotOffers })
})

exports.getTodayOffers = catchAsync(async (req, res, next) => {
  const hotOffers = Offer.find({ where: { discount: { [Op.gte]: 40 } } })
  if (!hotOffers) return next(new AppError("Cant find hot offers", 500))
  res.status(200).json({ status: "success", data: hotOffers })
})
