const express = require("express")
const cinemaController = require("../controllers/cinemaController")
const authController = require("../controllers/authController")
const db = require("./../models/index")
const Employee = db.employee
const router = express.Router()

router.route("/:id/movies/:movieId").get(cinemaController.getMovieFromCinema)

router
  .route("/:id/movies")
  .get(cinemaController.getCinemaMovies)
  .post(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.addMovieToCinema
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.removeMovieFromCinema
  )
router
  .route("/:id")
  .get(cinemaController.getCinemaById)
  .patch(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.updateCinema
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("manager", "sub-manager"),
    cinemaController.deleteCinema
  )
router.route("/").get(cinemaController.getAllCinemas).post(
  // authController.protect(Employee),
  // authController.restrictTo("manager", "sub-manager"),
  cinemaController.addCinema
)

module.exports = router
