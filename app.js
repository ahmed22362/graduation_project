const express = require("express")
const morgan = require("morgan")
const globalErrorHandler = require("./controllers/errorController")
const userRoute = require("./routes/userRoute")
const visitRouter = this.request("./routes/visitRouter.js")
const app = express()

app.use(express.json())
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"))
}
app.use(express.json())

app.use("/api/v1/users", userRoute)
app.use("/api/v1/visits", visitRouter)

app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "hi",
  })
})
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
