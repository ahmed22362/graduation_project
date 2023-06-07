const app = require("./app")
const dotenv = require("dotenv")
const db = require("./models/index")
const employeeController = require("./controllers/employeeController")
// const makeData = require("./utils/dummyData")
dotenv.config({ path: __dirname + "/config.env" })

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
db.sequelize
  .sync()
  .then(() => {
    employeeController.findModelAndManager()
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
