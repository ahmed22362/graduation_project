const express = require("express")
const offerController = require("../controllers/offerController")
const authController = require("../controllers/authController")
const router = express.Router()

// router.use(
//   authController.protect,
//   authController.restrictTo("manager", "sub-manager")
// )
router
  .route("/")
  .get(offerController.getAllOffers)
  .post(offerController.addOffer)
router
  .route("/:id")
  .get(offerController.getOfferById)
  .delete(offerController.deleteOffer)
  .patch(offerController.updateOffer)

module.exports = router