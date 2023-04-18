const app = require("./app")
const dotenv = require("dotenv")
const db = require("./models/index")
const catchAsync = require("./utils/catchAsync")
const initObj = require("./config/initObj")
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
  const [model, modelCreated] = await Employee.findOrCreate({
    where: initObj.modelWhere,
    defaults: initObj.modelDefault,
  })
  const [manager, managerCreated] = await Employee.findOrCreate({
    where: initObj.managerWhere,
    defaults: initObj.managerDefault,
  })
  if (managerCreated) {
    console.log("manager created.")
  }
  if (modelCreated) {
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
