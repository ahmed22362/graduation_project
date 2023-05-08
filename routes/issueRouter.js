const express = require("express")
const multer = require("multer")
const authController = require("./../controllers/authController")
const issueController = require("./../controllers/issueController")
const { storage } = require("./../utils/cloudinary")

const router = express.Router()

const upload = multer({ storage: storage("photos") })
router
  .route("/model")
  .all(authController.protect, authController.restrictTo(["model", "manager"]))
  .post(upload.single("image"), issueController.createModelIssue)
  .get(issueController.getModelIssues)
router
  .route("/model/:id")
  .all(authController.protect, authController.restrictTo(["model", "manager"]))
  .get(issueController.getModelIssue)
  .patch(upload.single("image"), issueController.updateModelIssue)
  .delete(issueController.deleteModelIssue)

router
  .route("/:id")
  .all(authController.protect, issueController.getUserId)
  .get(issueController.getIssue)
  .patch(upload.single("image"), issueController.updateIssue)
  .delete(issueController.deleteIssue)

router
  .route("/")
  .all(authController.protect, issueController.getUserId)
  .get(issueController.getUserIssues)
  .post(upload.single("image"), issueController.createIssue)
module.exports = router
