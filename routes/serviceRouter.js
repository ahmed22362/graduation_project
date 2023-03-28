const express = require("express")
const serviceController = require("../controllers/serviceController")
const authController = require("../controllers/authController")
const router = express.Router()

router
  .route("/:id")
  .get(serviceController.getServicesById)
  .patch(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    serviceController.updateService
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    serviceController.deleteService
  )
router.route("/").get(serviceController.getAllService).post(
  // authController.protect,
  // authController.restrictTo("manager", "sub-manager"),
  serviceController.addService
)
module.exports = router
