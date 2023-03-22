const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const sendEmail = require("../utils/email")

const crypto = require("crypto")
const { Op } = require("sequelize")
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const User = db.user

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSentToken = (user, statusCode, res) => {
  const token = signToken(user.id)
  // make the cookies option
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true

  // Send cookies
  res.cookie("jwt", token, cookieOptions)
  // Sent status
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  imageUrl = req.file ? req.file.path : null
  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    imageURL: imageURL,
  })
  createSentToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) Check if the email and password exits
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400))
  }
  // 2) Check if the user exist && The password is correct
  const user = await User.findOne({ where: { email } })
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401))
  }
  // 3) If every thing okay send token to clint
  createSentToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and Check if it's true
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access."),
      401
    )
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // 3) Check if the user still exist
  const user = await User.findByPk(decoded.id)
  if (!user) {
    return next(
      new AppError("The user belong's to this token no longer exist.")
    )
  }
  // 4) Check if user change password
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please login again.")
    )
  }

  // 5) Grant access to protected route
  req.user = user
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do this", 403))
    }
    next()
  }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // Find user
  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) {
    return next(new AppError("There is no user with this email address!", 404))
  }
  // Create reset token
  const code = user.createPasswordResetCode()
  await user.save()
  // Send code to user Email
  const message = `Forgot your password? Submit this code with your new password and passwordConfirm to validate.\
  \nIf you didn't request to reset your password please ignore this message.\
  \n Your code is ${code}`
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Code <valid for 10 min>",
      message,
    })
    res.status(200).json({
      status: "success",
      message: "Code sent to mail!",
    })
  } catch (error) {
    user.passwordResetCode = undefined
    user.passwordResetExpire = undefined
    user.save({ validate: false })
    console.log(error)
    return next(
      new AppError(
        "There wat an error during sending the email. Try again later.",
        500
      )
    )
  }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Find the user based on token
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex")
  // Check password and token
  const user = await User.findOne({
    where: {
      passwordResetCode: hashedCode,
      passwordResetExpire: { [Op.gt]: Date.now() },
    },
  })
  if (!user) {
    return next(new AppError("Code is invalid or has expire", 400))
  }
  // Update changedPasswordAt property for the user
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetCode = null
  user.passwordResetExpire = null
  // Update the user and log in via jwt
  await user.save()
  createSentToken(user, 200, res)
})

exports.updateUserPassword = catchAsync(async (req, res, next) => {
  // Get User
  const user = await User.findByPk(req.user.id)
  // Check password and compare it
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Entered password in not correct", 400))
  }
  // Update the user data
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // Log user in, send JWT
  createSentToken(user, 200, res)
})
