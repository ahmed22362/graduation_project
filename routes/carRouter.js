const express = require("express")
const carController = require("../controllers/carController")

router = express.Router()

router
  .route("/:plateNum")
  .get(carController.setIdPlateNum, carController.getCar)
  .patch(carController.setIdPlateNum, carController.updateCar)
  .delete(carController.setIdPlateNum, carController.deleteCar)
router
  .route("/")
  .get(carController.getCars)
  .post(carController.setColor, carController.addCar)
module.exports = router
