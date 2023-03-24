const express = require("express")
const carController = require("../controllers/carController")

router = express.Router()

router.get("/:plateNum", carController.getCar)
router.route("/").get(carController.getCars).post(carController.addCar)
module.exports = router
