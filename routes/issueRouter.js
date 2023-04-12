const express = require("express")
const issueController = require("./../controllers/issueController")
const router = express.Router()

router.route("/").get().post(issueController.createIssue)

module.exports = router
