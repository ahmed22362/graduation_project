const express = require("express")
const multer = require("multer")
const issueController = require("./../controllers/issueController")
const { storage } = require("./../utils/cloudinary")
const UserController = require("./../controllers/userController")
const employeeController = require("./../controllers/employeeController")
const authController = require("./../controllers/authController")
const router = express.Router()

const upload = multer({ storage: storage("issue photos") })

// model issues
router
  .route("/model")
  .all(
    employeeController.protectEmployee,
    authController.restrictTo(["model", "manager"])
  )
  .post(upload.single("image"), issueController.createModelIssue)
  .get(issueController.getModelIssues)
router
  .route("/model/:id")
  .all(
    employeeController.protectEmployee,
    authController.restrictTo(["model", "manager"])
  )
  .get(issueController.getModelIssue)
  .patch(upload.single("image"), issueController.updateModelIssue)
  .delete(issueController.deleteModelIssue)

// user issues
router
  .route("/user/:id")
  .all(UserController.protectUser, issueController.getUserId)
  .get(issueController.getIssue)
  .patch(upload.single("image"), issueController.updateIssue)
  .delete(issueController.deleteIssue)

router
  .route("/user")
  .all(UserController.protectUser, issueController.getUserId)
  .get(issueController.getUserIssues)
  .post(upload.single("image"), issueController.createIssue)

router
  .route("/")
  .all(
    employeeController.protectEmployee,
    authController.restrictTo(["manager", "model"])
  )
  .get(issueController.getAllIssues)
  .post(upload.single("image"), issueController.createIssue)
module.exports = router
