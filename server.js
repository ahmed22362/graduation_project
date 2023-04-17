const app = require("./app")
const dotenv = require("dotenv")
const db = require("./models/index")
const catchAsync = require("./utils/catchAsync")
const initWhere = require("./config/initWhere")
const Employee = db.employee

dotenv.config({ path: __dirname + "/config.env" })

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
db.sequelize
  .sync()
  .then(() => {
    findModelAndManager()
    console.log("Rsync Database")
  })
  .catch((err) => {
    console.log(`some thing wrong happened like ${err}`)
  })

const findModelAndManager = catchAsync(async () => {
  const [model, created] = await Employee.findOrCreate({
    where: initWhere.modelWhere,
    defaults: initWhere.modelWhere,
  })
  const [manager, managerCreated] = await Employee.findOrCreate({
    where: initWhere.managerWhere,
    defaults: initWhere.managerWhere,
  })
  if (managerCreated) {
    console.log("manager created.")
  }
  if (created) {
    console.log("model created.")
  }
})

process.on("unhandledRejection", (err) => {
  console.log(err.name, `this is message :${err}`)
  console.log("UnhandledRejection Shutting down .......")
  server.close(() => {
    process.exit(1)
  })
})
