const app = require("./app")
const dotenv = require("dotenv")
const db = require("./models/index")
const catchAsync = require("./utils/catchAsync")

dotenv.config({ path: __dirname + "/config.env" })

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
db.sequelize
  .sync()
  .then(() => {
    // init()
    console.log("Rsync Database")
  })
  .catch((err) => {
    console.log(`some thing wrong happened like ${err}`)
  })

process.on("unhandledRejection", (err) => {
  console.log(err.name, `this is message :${err}`)
  console.log("UnhandledRejection Shutting down .......")
  server.close(() => {
    process.exit(1)
  })
})
