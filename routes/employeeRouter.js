const express = require("express")
const router = express.Router()
const db = require("../models/index")
const employeeController = require("../controllers/employeeController")
const authController = require("./../controllers/authController")

router.route("/login").post(authController.login(db.employee))
router
  .route("/:id")
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.delete)
router
  .route("/")
  .get(employeeController.getAll)
  .post(employeeController.addEmployee)

module.exports = router
