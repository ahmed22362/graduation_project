const express = require("express")
const authController = require("./../controllers/authController")
const issueController = require("./../controllers/issueController")
const router = express.Router()

router
  .route("/:id")
  .all(authController.protect, issueController.getUserId)
  .get(issueController.getIssue)
  .patch(issueController.updateIssue)
  .delete(issueController.deleteIssue)

router
  .route("/")
  .all(authController.protect, issueController.getUserId)
  .get(issueController.getUserIssues)
  .post(issueController.createIssue)
module.exports = router
