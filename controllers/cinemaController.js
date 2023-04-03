const catchAsync = require("../utils/catchAsync")
const db = require("../models/index")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")
const filterObj = require("../utils/filterObj")
// const filterObj = require("../utils/filterObj")
const Cinema = db.cinema
const Movie = db.movie
// To get all cinema also query based on name and id if exist
exports.getAllCinemas = catchAsync(async (req, res, next) => {
  // Define empty where object
  let whereObj = {}
  // Define allowed query
  const filteredWhere = filterObj(
    req.query,
    "id",
    "name",
    "location",
    "openAt",
    "closeAt"
  )
  // op.or make problem if the filtered query is empty it return nothing
  // So i first checked if the query empty or not and then assign the value to the where object
  if (Object.entries(filteredWhere).length > 0) {
    whereObj = { [Op.or]: filteredWhere }
  }
  // if the where object is empty it return every thing
  const cinemas = await Cinema.findAll({
    where: whereObj,
  })
  if (!cinemas) {
    return next(new AppError("Error During getting cinemas!", 500))
  }
  res.status(200).json({ status: "success", data: cinemas })
})

exports.getCinemaById = catchAsync(async (req, res, next) => {
  console.log(req.params.id)
  const cinema = await Cinema.findByPk(req.params.id)
  if (!cinema) {
    return next(new AppError("can't find cinema", 500))
  }
  res.status(200).json({ status: "success", data: cinema })
})

exports.addCinema = catchAsync(async (req, res, next) => {
  const { name, location, openAt, closeAt, phone, cinemaType, offerId } =
    req.body
  const cinema = await Cinema.create({
    name,
    location,
    openAt,
    closeAt,
    phone,
    cinemaType,
    offerId,
  })
  if (!cinema) return next(new AppError("Can't add cinema!", 500))
  res.status(200).json({ status: "success", data: cinema })
})

exports.updateCinema = catchAsync(async (req, res, next) => {
  // find the wanted cinema
  const id = req.params.id
  const cinema = await Cinema.findByPk(id)
  if (!cinema) return next(new AppError("can't find cinema with this id", 404))
  const imageUrl = req.file ? req.file.path : null

  const { name, location, openAt, closeAt, phone, offerId } = req.body
  // save Change on cinema
  await cinema.update({
    name,
    location,
    openAt,
    closeAt,
    phone,
    imageUrl,
    offerId,
  })
  // send result
  res.status(200).json({ status: "success", data: cinema })
})

exports.deleteCinema = catchAsync(async (req, res, next) => {
  const cinema = await Cinema.findByPk(req.params.id)
  if (!cinema) return next(new AppError("Can't find cinema with this id", 404))
  await cinema.destroy()
  res.status(200).json({ status: "success", data: null })
})

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
exports.getCinemaMovies = catchAsync(async (req, res, next) => {
  const cinema = await Cinema.findByPk(req.params.id, {
    include: "movie",
  })
  if (!cinema) return next(new AppError("can't find cinema", 404))
  res.status(200).json({ status: "success", data: cinema.movie })
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
