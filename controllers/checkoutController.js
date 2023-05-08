const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const User = db.user
const Movie = db.movie
const Checkout = db.check_out

exports.addToCheckout = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id)
  const movieId = req.body.movieId
  const movie = await Movie.findByPk(movieId)
  if (!movie) return next(new AppError("please provide valid movie id", 404))
  await user.addMovie(movieId, {
    through: {
      ticketPrice: movie.ticketPrice,
      ticketNum: req.body.ticketNum,
      cost: movie.ticketPrice * req.body.ticketNum,
    },
  })
  res.status(200).json({ status: "success" })
})

exports.getCheckOut = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    include: {
      model: Checkout,
      include: Movie,
    },
  })
  if (!user) return next(new AppError("can't get user checkout", 400))
  const { checkouts } = user
  res.status(200).json({ status: "success", data: checkouts })
})

exports.removeFromCheckout = catchAsync(async (req, res, next) => {
  const user = req.user
  const movieId = req.body.movieId
  if (!movieId) return next(new AppError("please provide movie id", 404))
  await user.removeMovie(movieId)
  res.status(200).json({ status: "success" })
})

exports.updateCheckoutStatus = catchAsync(async (req, res, next) => {
  const checkout = await Checkout.findByPk(req.params.id)
  if (!checkout)
    return next(new AppError("can't find this check with this id", 404))
  await checkout.update({ status: req.body.status })
  res.status(200).json({ stats: "success" })
})
