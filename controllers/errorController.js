const AppError = require("./../utils/appError")

const handleUniqueErrorDB = (err) => {
  const message = `Duplicate field. Please use another value!`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  console.log(err)
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value)

  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${error.join(". \n")}`
  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError("Invalid token! please login again.", 401)
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! please login again.", 401)

const sendErrorDev = (err, res, req) => {
  console.log(`${req.ip}-:` + err.message)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res, req) => {
  console.log(`${req.ip}-:` + err.message)
  res.status(200).json({
    status: err.status,
    message: err.message,
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"
  if (process.env.NODE_ENV.trim() === "development") {
    sendErrorDev(err, res, req)
  } else if (process.env.NODE_ENV.trim() === "production") {
    // let error = { ...err }
    // if (err.name === "SequelizeUniqueConstraintError")
    //   error = handleUniqueErrorDB(err)
    // if (err.code === 11000) error = handleDuplicateFieldsDB(err)
    // if (err.name === "SequelizeValidationError")
    //   error = handleValidationErrorDB(err)
    // if (err.name === "JsonWebTokenError") error = handleJWTError()
    // if (err.name === "TokenExpiredError") error = handleJWTExpiredError()
    sendErrorProd(err, res, req)
  }
}
