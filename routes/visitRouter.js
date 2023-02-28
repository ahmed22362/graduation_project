const visitController = require("../controllers/visitController")
const app = require("express")

const router = app.Router()

router
  .route("/")
  .get(visitController.getAllVisits)
  .post(visitController.addVisit)
router.route("/:id").get().patch().delete()
module.exports = router
