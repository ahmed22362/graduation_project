const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")

router.get("/:id/cinemas", movieController.getMovieCinemas)
router
  .route("/:id")
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie)

router.route("/").get(movieController.getMovies).post(movieController.addMovie)

module.exports = router
