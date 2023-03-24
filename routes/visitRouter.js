const visitController = require("../controllers/visitController")
const app = require("express")

const router = app.Router()

router.route("/visitCarIn").post(visitController.visitCarIn)
router.route("/visitCarOut").post(visitController.visitCarOut)
router.route("/sections").get(visitController.getSectionCapacity)
router
  .route("/:id")
  .get(visitController.getVisitById)
  .patch(visitController.updateVisitById)
  .delete(visitController.deleteVisitById)
router
  .route("/:plateNum")
  .get(visitController.getVisitsByCar)
  .delete(visitController.deleteCarVisits)
router
  .route("/")
  .get(visitController.getAllVisits)
  .post(visitController.addVisit)
module.exports = router
