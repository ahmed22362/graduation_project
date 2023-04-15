const db = require("../models/index")
const factory = require("./factoryHandler")
const Offer = db.offer
// Get all offers
exports.getAllOffers = factory.getAll(Offer)
// Add new Offer
exports.addOffer = factory.createOne(Offer)
// Get Offer by id
exports.getOfferById = factory.getOne(Offer)
// Delete Offer by id
exports.deleteOffer = factory.deleteOne(Offer)
// Update offer by id
exports.updateOffer = factory.updateOne(Offer)
