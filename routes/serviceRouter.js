const express = require("express")
const serviceController = require("../controllers/serviceController")
const router = express.Router()

router
  .route("/")
  .post(serviceController.addService)
  .get(serviceController.getAllService)
router.route("/:name").get(serviceController.getServicesByName)
router.route("/:id").get(serviceController.getServicesById)

module.exports = router
