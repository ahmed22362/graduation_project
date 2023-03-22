const express = require("express")
const morgan = require("morgan")
const globalErrorHandler = require("./controllers/errorController")
const userRoute = require("./routes/userRoute")
const visitRouter = require("./routes/visitRouter")
const carRouter = require("./routes/carRouter")
const serviceRouter = require("./routes/serviceRouter")
const storage = require("./utils/cloudinary")
const multer = require("multer")

const app = express()
app.use(express.json())
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"))
}
app.use(express.json())

const upload = multer({ storage: storage })

app.use("/api/v1/users", userRoute)
app.use("/api/v1/visits", visitRouter)
app.use("/api/v1/cars", carRouter)
app.use("/api/v1/services", serviceRouter)
app.use("/api/v1/upload", upload.single("image"), async (req, res, next) => {
  imageUrl = req.file ? req.file.path : null
  res.status(200).json({ imageUrl: imageUrl })
})
app.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "home page",
  })
})
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
