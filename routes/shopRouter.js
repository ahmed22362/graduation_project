const express = require("express")
const shopController = require("../controllers/shopController")
const authController = require("../controllers/authController")
const router = express.Router()
const multer = require("multer")
const { storage } = require("./../utils/cloudinary")

const upload = multer({ storage: storage("photos") })
router.route("/hot-offer").get(shopController.getHotOffersShops)
router.route("/today-offers").get(shopController.getTodayOffersShops)
router.route("/offers").get(shopController.getShopsOffers)
router
  .route("/:id/offer")
  .get(shopController.getShopOffers)
  .post(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    upload.single("image"),
    shopController.addOfferToShop
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    shopController.removeOfferFromShop
  )
router
  .route("/:id")
  .get(shopController.getShopsById)
  .patch(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    upload.single("image"),
    shopController.updateShop
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    shopController.deleteShop
  )
router.route("/").get(shopController.getAllShop).post(
  // authController.protect,
  // authController.restrictTo("manager", "sub-manager"),
  upload.single("image"),
  shopController.addShop
)
module.exports = router
