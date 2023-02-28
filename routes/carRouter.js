const express = require("express")
const carController = require("../controllers/carController")

router = express.Router()

router.route("/").get(carController.getCars).post(carController.addCar)
router.get("/:plateNum", carController.getCar)
module.exports = router
