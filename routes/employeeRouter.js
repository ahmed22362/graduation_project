const express = require("express")
const multer = require("multer")

const router = express.Router()
const employeeController = require("../controllers/employeeController")
const { storage } = require("./../utils/cloudinary")

const upload = multer({ storage: storage("photos") })

router.route("/login").post(employeeController.logInEmployee)
router
  .route("/:id")
  .get(employeeController.getEmployee)
  .patch(upload.single("image"), employeeController.updateEmployee)
  .delete(employeeController.delete)
router
  .route("/")
  .get(employeeController.getAll)
  .post(upload.single("image"), employeeController.addEmployee)

module.exports = router
