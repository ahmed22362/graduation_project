const db = require("../models/index")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const sendEmail = require("../utils/email")

const crypto = require("crypto")
const { Op } = require("sequelize")
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const User = db.user

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSentToken = (model, statusCode, res) => {
  const token = signToken({ id: model.id })
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
  const name = model.constructor.getTableName()
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      model,
    },
  })
}

exports.signup = (Model) =>
  catchAsync(async (req, res, next) => {
    imageUrl = req.file ? req.file.path : null
    let passwordConfirm
    if (req.body.confirmPassword) {
      passwordConfirm = req.body.confirmPassword
    }
    passwordConfirm = req.body.passwordConfirm
    let phone = parseInt(req.body.phone) || 0
    if (!(req.body.name || req.body.password))
      return next(new AppError("please provide missed information"))
    if (req.body.password != passwordConfirm)
      return next(new AppError("the password must match", 400))
    // Create new user
    const newModel = await Model.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: passwordConfirm,
      phone: phone,
      imageURL: imageUrl,
    })
    createSentToken(newModel, 201, res)
  })

exports.login = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // 1) Check if the email and password exits
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400))
    }
    // 2) Check if the user exist && The password is correct
    const model = await Model.findOne({ where: { email } })
    if (!model || !(await model.correctPassword(password, model.password))) {
      return next(new AppError("Incorrect email or password", 401))
    }
    // 3) If every thing okay send token to clint
    createSentToken(model, 200, res)
  })

exports.protect = (Model) =>
  catchAsync(async (req, res, next) => {
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
    let decoded = ""
    // 2) Verification token
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    } catch (error) {
      return next(new AppError(`${error.message} - Token is not valid`, 400))
    }
    // 3) Check if the user still exist
    console.log(decoded)
    const model = await Model.findByPk(decoded.id)
    if (!model) {
      return next(
        new AppError("The user belong's to this token no longer exist.")
      )
    }
    const name = model.constructor.getTableName()
    if (name == "user") {
      // 4) Check if user change password
      if (model.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError("User recently changed password! please login again.")
        )
      }
    }
    // 5) Grant access to protected route
    if (name == "user") {
      req.user = model
    } else if (name == "employee") {
      req.employee = model
    } else {
      req.model = model
    }
    next()
  })

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.employee)
    if (!roles.includes(req.employee.role)) {
      return next(new AppError("You do not have permission to do this", 403))
    }
    next()
  }
}

exports.forgetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    // Find user
    const model = await Model.findOne({ where: { email: req.body.email } })
    if (!model) {
      return next(
        new AppError("There is no user with this email address!", 404)
      )
    }
    // Create reset token
    const code = model.createPasswordResetCode()
    await model.save()
    // Send code to user Email
    const message = `Forgot your password? Submit this code with your new password and passwordConfirm to validate.\
  \nIf you didn't request to reset your password please ignore this message.\
  \n Your code is ${code}`
    try {
      await sendEmail({
        email: model.email,
        subject: "Your password reset Code <valid for 10 min>",
        message,
      })
      res.status(200).json({
        status: "success",
        message: "Code sent to mail!",
      })
    } catch (error) {
      model.passwordResetCode = undefined
      model.passwordResetExpire = undefined
      model.save({ validate: false })
      console.log(error)
      return next(
        new AppError(
          "There wat an error during sending the email. Try again later.",
          500
        )
      )
    }
  })
exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    // Find the user based on token
    const hashedCode = crypto
      .createHash("sha256")
      .update(req.body.code)
      .digest("hex")
    // Check password and token
    const model = await Model.findOne({
      where: {
        passwordResetCode: hashedCode,
        passwordResetExpire: { [Op.gt]: Date.now() },
      },
    })
    if (!model) {
      return next(new AppError("Code is invalid or has expire", 400))
    }
    // Update changedPasswordAt property for the user
    model.password = req.body.password
    model.passwordConfirm = req.body.passwordConfirm
    model.passwordResetCode = null
    model.passwordResetExpire = null
    // Update the user and log in via jwt
    await model.save()
    createSentToken(model, 200, res)
  })

exports.updateUserPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    // Get User
    const model = await Model.findByPk(req.user.id)
    // Check password and compare it
    if (
      !(await model.correctPassword(req.body.passwordCurrent, model.password))
    ) {
      return next(new AppError("Invalid current password", 401))
    }
    // Update the user data
    model.password = req.body.password
    model.passwordConfirm = req.body.passwordConfirm
    await model.save()
    // Log user in, send JWT
    createSentToken(model, 200, res)
  })
