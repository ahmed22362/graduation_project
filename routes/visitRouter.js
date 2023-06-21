const visitController = require("../controllers/visitController")
const app = require("express")

const router = app.Router()

router.route("/visitCarIn").post(visitController.visitCarIn)
router.route("/visitCarOut").post(visitController.visitCarOut)
router.route("/sections").get(visitController.getSectionCapacity)
router
  .route("/car/:plateNum")
  .get(visitController.getVisitByCar)
  .delete(visitController.deleteCarVisits)
router.get("/car/:plateNum/all", visitController.getAllCarVisit)
router
  .route("/:id")
  .get(visitController.getVisitById)
  .patch(visitController.updateVisitById)
  .delete(visitController.deleteVisitById)
router
  .route("/")
  .get(visitController.getAllVisits)
  .post(visitController.addVisit)
module.exports = router
