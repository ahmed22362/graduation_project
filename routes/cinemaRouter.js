const express = require("express")
const multer = require("multer")
const cinemaController = require("../controllers/cinemaController")
const employeeController = require("./../controllers/employeeController")
const authController = require("./../controllers/authController")
const { storage } = require("./../utils/cloudinary")

const upload = multer({ storage: storage("photos/cinema") })

const router = express.Router()
router
  .route("/:cinemaId/movies/:movieId")
  .get(cinemaController.getMovieFromCinema)

router
  .route("/:cinemaId/movies")
  .get(cinemaController.getCinemaMovies)
  .post(
    // employeeController.protectEmployee,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.addMovieToCinema
  )
  .delete(
    // employeeController.protectEmployee,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.removeMovieFromCinema
  )
router
  .route("/:id")
  .get(cinemaController.getCinemaById)
  .patch(
    // employeeController.protectEmployee,
    // authController.restrictTo("manager", "sub-manager"),
    upload.single("image"),
    cinemaController.updateCinema
  )
  .delete(
    // employeeController.protectEmployee,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.deleteCinema
  )
router.route("/").get(cinemaController.getAllCinemas).post(
  // employeeController.protectEmployee,
  // authController.restrictTo("manager", "sub-manager"),
  upload.single("image"),
  cinemaController.addCinema
)

module.exports = router
