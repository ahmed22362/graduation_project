const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const factory = require("./factoryHandler")
// const filterObj = require("../utils/filterObj")
const Cinema = db.cinema
const Movie = db.movie

const AllowedParams = ["id", "name", "location", "openAt", "closeAt"]
// To get all cinema also query based on name and id if exist
exports.getAllCinemas = factory.getAll(Cinema, AllowedParams)
exports.getCinemaById = factory.getOne(Cinema)
exports.addCinema = factory.createOne(Cinema)
exports.updateCinema = factory.updateOne(Cinema)
exports.deleteCinema = factory.deleteOne(Cinema)
exports.getCinemaMovies = factory.getOne(Cinema, { model: Movie, as: "movie" })

// use the super auto generated function addModel in Sequelize to add many to many values
exports.addMovieToCinema = catchAsync(async (req, res, next) => {
  // find the cinema
  const cinema = await Cinema.findByPk(req.params.id)
  if (!cinema)
    return next(new AppError("There are no cinema with this id", 404))
  // find the movie
  const movie = await Movie.findByPk(req.body.movieId)
  if (!movie) return next(new AppError("There are no movie with this id", 404))
  // add the movie
  await cinema.addMovie(movie.id)
  res.status(200).json({ status: "success", msg: "movie added successfully" })
})

exports.removeMovieFromCinema = catchAsync(async (req, res, next) => {
  // find the cinema
  const cinema = await Cinema.findByPk(req.params.id)
  if (!cinema)
    return next(new AppError("There are no cinema with this id", 404))
  // find the movie
  const movie = await Movie.findByPk(req.body.movieId)
  if (!movie) return next(new AppError("There are no movie with this id", 404))
  // check if the cinema have this move
  const cinemaAndMovie = await Cinema.findByPk(req.params.id, {
    include: {
      model: db.cinema_movie,
      where: { movieId: req.body.movieId },
    },
  })
  if (!cinemaAndMovie)
    return next(new AppError("Cinema have no Movie with this id!", 404))
  // remove the movie
  await cinema.removeMovie(movie.id)
  res.status(200).json({ status: "success", msg: "movie removed successfully" })
})

exports.getMovieFromCinema = catchAsync(async (req, res, next) => {
  // find the cinema
  const cinema = await Cinema.findByPk(req.params.id)
  if (!cinema)
    return next(new AppError("There are no cinema with this id", 404))
  // find the movie
  const movie = await Movie.findByPk(req.params.movieId)
  if (!movie) return next(new AppError("There are no movie with this id", 404))
  // check if the cinema have this move
  const cinemaMovie = await Cinema.findByPk(req.params.id, {
    include: {
      model: db.cinema_movie,
      where: { movieId: req.params.movieId },
      include: "movie",
    },
  })
  if (!cinemaMovie)
    return next(new AppError("Cinema have no Movie with this id!", 404))
  // remove the movie
  res
    .status(200)
    .json({ status: "success", data: cinemaMovie.cinema_movies[0].movie })
})
