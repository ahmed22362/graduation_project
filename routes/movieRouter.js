const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")

router
  .route("/:id")
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie)

router.route("/").get(movieController.getMovies).post(movieController.addMovie)

module.exports = router
