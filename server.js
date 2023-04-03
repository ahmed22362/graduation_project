const app = require("./app")
const dotenv = require("dotenv")
const db = require("./models/index")
const catchAsync = require("./utils/catchAsync")

dotenv.config({ path: __dirname + "/config.env" })

const port = process.env.PORT || 8000
const User = db.user
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

function init() {
  Role.create({
    id: 0,
    name: "user",
  })
  Role.create({
    id: 1,
    name: "moderator",
  })
  Role.create({
    id: 2,
    name: "admin",
  })
}
process.on("unhandledRejection", (err) => {
  console.log(err.name, `this is message :${err}`)
  console.log("UnhandledRejection Shutting down .......")
  server.close(() => {
    process.exit(1)
  })
})
