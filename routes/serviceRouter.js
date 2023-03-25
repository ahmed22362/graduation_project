const express = require("express")
const serviceController = require("../controllers/serviceController")
const router = express.Router()

// router.route("/:name").get(serviceController.getServicesByName)
// You can send query with name or type in this route to get specif service
router.route("/:id").get(serviceController.getServicesById)
router.get("/", serviceController.getAllService)

// router.use(
//   authController.protect,
//   authController.restrictTo("manager", "sub-manager")
// )
router.post("/", serviceController.addService)
router.patch("/:id", serviceController.updateService)
module.exports = router
