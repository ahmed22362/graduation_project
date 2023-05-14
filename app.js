const express = require("express")
const morgan = require("morgan")
const multer = require("multer")
const cors = require("cors")

// routers
const userRoute = require("./routes/userRoute")
const visitRouter = require("./routes/visitRouter")
const carRouter = require("./routes/carRouter")
const shopRouter = require("./routes/shopRouter")
const cinemaRouter = require("./routes/cinemaRouter")
const offerRouter = require("./routes/offerRouter")
const movieRouter = require("./routes/movieRouter")
const issueRouter = require("./routes/issueRouter")
const employeeRouter = require("./routes/employeeRouter")
const managerRouter = require("./routes/managerRouter")
// cloudinary
const { storage } = require("./utils/cloudinary")
// handel errors
const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")

// swagger doc
const swagger = require("./swagger/swagger")

const app = express()
app.use(express.json())
console.log(process.env.NODE_ENV)

app.use(morgan("dev"))
const upload = multer({ storage: storage("gFolder") })

// allow access from all origins - note: this is security risk-
// app.use(
//   cors({
//     origin: "*",
//     methods: "*",
//     allowedHeaders: "*",
//   })
// )
// app.use((req, res, next) => {
//   res.set("Access-Control-Allow-Origin", "*")
//   res.set("Access-Control-Allow-Headers", "*")
//   res.set("Access-Control-Allow-Methods", "*")
//   next()
// })
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,PATCH, OPTIONS"
  )
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

swagger(app)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/visits", visitRouter)
app.use("/api/v1/cars", carRouter)
app.use("/api/v1/shops", shopRouter)
app.use("/api/v1/cinemas", cinemaRouter)
app.use("/api/v1/offers", offerRouter)
app.use("/api/v1/movies", movieRouter)
app.use("/api/v1/issues", issueRouter)
app.use("/api/v1/employees", employeeRouter)
app.use("/api/manager", managerRouter)

app.post("/api/v1/upload", upload.single("image"), async (req, res) => {
  imageUrl = req.file ? req.file.path : ""
  // const result = await uploadImage(req.file.path)
  // console.log(result)
  console.log(imageUrl)
  res.status(200).json({ body: { imageUrl } })
})
app.get("/upload-image", (req, res) => {
  res.sendFile(__dirname + "/assets/index.html")
})

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
