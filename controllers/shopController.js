const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const { Op, where } = require("sequelize")
const filterObj = require("../utils/filterObj")
// const filterObj = require("../utils/filterObj")
const Shop = db.shop
const Offer = db.offer
const shopAllowedParams = ["id", "name", "location", "shopType", "openAt"]
function filterShopQuery(obj, ...params) {
  var whereObj = {}
  // Define allowed query
  const filteredWhere = filterObj(obj, params)
  // op.or make problem if the filtered query is empty it return nothing
  // So i first checked if the query empty or not and then assign the value to the where object
  if (Object.entries(filteredWhere).length > 0) {
    whereObj = { [Op.or]: filteredWhere }
  }
  return whereObj
}

// To get all shop also query based on name and id if exist
exports.getAllShop = catchAsync(async (req, res, next) => {
  // Define empty where object
  const whereObj = filterShopQuery(req.query, shopAllowedParams)
  // if the where object is empty it return every thing
  const shops = await Shop.findAll({
    where: whereObj,
  })
  if (!shops) {
    return next(new AppError("Error During getting shops!", 500))
  }
  res.status(200).json({ status: "success", data: shops })
})

exports.getShopsById = catchAsync(async (req, res, next) => {
  const shop = await Shop.findByPk(req.params.id)
  if (!shop) {
    return next(new AppError("can't find shop", 500))
  }
  res.status(200).json({ status: "success", data: shop })
})

exports.addShop = catchAsync(async (req, res, next) => {
  const imageUrl = req.file ? req.file.path : null
  const { name, location, openAt, closeAt, phone, shopType, offerId } = req.body
  const shop = await Shop.create({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    shopType,
    offerId,
  })
  if (!shop) return next(new AppError("Can't add shop!", 500))
  res.status(200).json({ status: "success", data: shop })
})

exports.updateShop = catchAsync(async (req, res, next) => {
  // find the wanted shop
  const id = req.params.id
  const shop = await Shop.findByPk(id)
  if (!shop) return next(new AppError("can't find shop with this id", 404))
  const imageUrl = req.file ? req.file.path : null

  const { name, location, openAt, closeAt, phone, shopType, offerId } = req.body
  // save Change on shop
  await shop.update({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    shopType,
    offerId,
  })
  // send result
  res.status(200).json({ status: "success", data: shop })
})

exports.deleteShop = catchAsync(async (req, res, next) => {
  const shop = await Shop.findByPk(req.params.id)
  if (!shop) return next(new AppError("Can't find shop with this id", 404))
  await shop.destroy()
  res.status(200).json({ status: "success", data: null })
})

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
  const whereObj = filterShopQuery(req.query, shopAllowedParams)
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
  const whereObj = filterShopQuery(req.query, shopAllowedParams)
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
