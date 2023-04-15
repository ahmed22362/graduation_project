const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const filterObj = require("../utils/filterObj")
const factory = require("./factoryHandler")
const { Op } = require("sequelize")
const Shop = db.shop
const Offer = db.offer
// The allowed params to query with
const AllowedParams = [
  "id",
  "name",
  "location",
  "shopType",
  "openAt",
  "closeAt",
]

exports.getAllShop = factory.getAll(Shop, AllowedParams)
exports.getShopsById = factory.getOne(Shop)
exports.addShop = factory.createOne(Shop)
exports.updateShop = factory.updateOne(Shop)
exports.deleteShop = factory.deleteOne(Shop)

exports.addOfferToShop = catchAsync(async (req, res, next) => {
  const shop = await Shop.findByPk(req.params.id)
  if (!shop) return next(new AppError("can't find shop with this id", 404))
  const offer = await Offer.findByPk(req.body.offerId)
  if (!offer) return next(new AppError("can't find offer with this id", 404))
  await shop.addOffer(offer.id)
  res
    .status(200)
    .json({ status: "success", msg: "offer added to shop successfully." })
})

exports.removeOfferFromShop = catchAsync(async (req, res, next) => {
  const shop = Shop.findByPk(req.params.id)
  if (!shop) return next(new AppError("Cant' find shop with this id", 404))
  const offer = await Offer.findByPk(req.body.offerId)
  if (!offer) return next(new AppError("can't find offer with this id", 404))
  await shop.removeOffer(offer.id)
  res
    .status(200)
    .json({ status: "success", msg: "offer removed from shop successfully." })
})
// return the shops with all offers
exports.getShopsOffers = catchAsync(async (req, res, next) => {
  const shops = await Shop.findAll({ include: "offer" })
  if (!shops) return next(new AppError("can't find shops", 404))
  res.status(200).json({ status: "success", data: shops })
})

// return all offers of one shop by id
exports.getShopOffers = catchAsync(async (req, res, next) => {
  const shop = await Shop.findByPk(req.params.id, {
    include: "offer",
  })
  if (!shop) return next(new AppError("can't find shop with this id", 404))
  res.status(200).json({ status: "success", data: shop.offer })
})

// return the offers that have discount larger than 40
exports.getHotOffersShops = catchAsync(async (req, res, next) => {
  // apply the filter
  const whereObj = filterObj(req.query, AllowedParams)
  // find all shops with filter and offer that have discount larger than 40 and not ended yet
  const shops = await Shop.findAll({
    where: whereObj,
    include: {
      model: Offer,
      as: "offer",
      where: {
        [Op.and]: {
          discount: { [Op.gte]: 40 },
          endAt: { [Op.gte]: Date.now() },
        },
      },
    },
  })
  if (!shops)
    return next(
      new AppError("can't find shops whit offer something wrong happened", 400)
    )
  res.status(200).json({ status: "success", data: shops })
})

exports.getTodayOffersShops = catchAsync(async (req, res, next) => {
  // apply filter
  const whereObj = filterObj(req.query, AllowedParams)
  // find shops with filter and include offer where it not ended yet
  const shops = await Shop.findAll({
    where: whereObj,
    include: {
      model: Offer,
      as: "offer",
      where: { endAt: { [Op.gte]: Date.now() } },
    },
  })
  if (!shops)
    return next(
      new AppError("can't find shops whit offer something wrong happened", 400)
    )
  res.status(200).json({ status: "success", data: shops })
})
