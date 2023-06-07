const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const factory = require("./factoryHandler")
const Movie = db.movie
const Cinema = db.cinema

const AllowedParams = [
  "id",
  "name",
  "duration",
  "release",
  "genre",
  "ticketPrice",
  "cinemaId",
  "imageUrl",
]

// get all movies with selected query
exports.getMovies = factory.getAll(Movie, {}, {})
exports.updateMovie = factory.updateOne(Movie)
exports.getMovie = factory.getOne(Movie, {}, { model: Cinema, as: "cinema" })
exports.deleteMovie = factory.deleteOne(Movie)
exports.addMovie = factory.createOne(Movie)
exports.getMovieCinemas = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByPk(req.params.id, { include: "cinema" })
  if (!movie) return next(new AppError("can't find movie with this id", 404))
  res.status(200).json({ status: "success", data: movie.cinema })
})
