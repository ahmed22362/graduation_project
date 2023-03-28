const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const filterObj = require("../utils/filterObj")
const Movie = db.movie

exports.addMovie = catchAsync(async (req, res, next) => {
  const {
    name,
    duration,
    release,
    description,
    genre,
    time,
    ticketPrice,
    serviceId,
  } = req.body
  const movie = await Movie.create({
    name,
    duration,
    release,
    description,
    genre,
    time,
    ticketPrice,
    serviceId,
  })
  if (!movie) return next(new AppError("can't create movie", 400))
  res.status(200).json({ status: "success", data: movie })
})

exports.getMovies = catchAsync(async (req, res, next) => {
  let whereClause = {}
  const filteredQuery = filterObj(
    req.query,
    "id",
    "name",
    "time",
    "genre",
    "duration",
    "release",
    "ticketPrice",
    "serviceId"
  )
  if (Object.entries(filteredQuery).length > 0) {
    whereClause = filteredQuery
  }
  const movies = await Movie.findAll({
    where: whereClause,
    include: ["service"],
  })
  if (!movies) return next(new AppError("can't get movies", 400))
  res.status(200).json({ status: "success", data: movies })
})

exports.updateMovie = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const {
    name,
    duration,
    release,
    description,
    genre,
    time,
    ticketPrice,
    serviceId,
  } = req.body
  const movie = await Movie.findByPk(id)
  const updatedMovie = await movie.update(
    {
      name,
      duration,
      release,
      description,
      genre,
      time,
      ticketPrice,
      serviceId,
    },
    { returning: true }
  )
  res.status(200).json({ status: "success", data: updatedMovie })
})

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const movie = await Movie.findByPk(id)
  if (!movie) return next(new AppError("can't find movie with this id", 404))
  await movie.destroy()
  res.status(200).json({ status: "success", data: null })
})
