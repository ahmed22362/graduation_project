const express = require("express")
const router = express.Router({ mergeParams: true })
const movieController = require("../controllers/movieController")
const multer = require("multer")
const { storage } = require("./../utils/cloudinary")

const upload = multer({ storage: storage("photos") })

router.get("/:id/cinemas", movieController.getMovieCinemas)
router
  .route("/:id")
  .get(movieController.getMovie)
  .patch(upload.single("image"), movieController.updateMovie)
  .delete(movieController.deleteMovie)

router
  .route("/")
  .get(movieController.getMovies)
  .post(upload.single("image"), movieController.addMovie)

module.exports = router
