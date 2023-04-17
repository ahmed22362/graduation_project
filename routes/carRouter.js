const express = require("express")
const carController = require("../controllers/carController")

router = express.Router()

router
  .route("/:plateNum")
  .all(carController.setIdPlateNum)
  .get(carController.getCar)
  .patch(carController.updateCar)
  .delete(carController.deleteCar)
router
  .route("/")
  .get(carController.getCars)
  .post(carController.setColor, carController.addCar)
module.exports = router
