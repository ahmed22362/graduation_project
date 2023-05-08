const db = require("./../models/index")
const factory = require("./factoryHandler")
const authController = require("./authController")
const catchAsync = require("./../utils/catchAsync")
const initObj = require("./../config/initObj")

const Employee = db.employee

exports.getAll = factory.getAll(Employee, {
  // exclude: ["password"],
})
exports.getEmployee = factory.getOne(Employee, {
  exclude: ["password"],
})
exports.updateEmployee = factory.updateOne(Employee)
exports.delete = factory.deleteOne(Employee)
exports.addEmployee = factory.createOne(Employee)
exports.logInEmployee = authController.login(Employee)
exports.protectEmployee = authController.protect(Employee)

exports.findModelAndManager = catchAsync(async () => {
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
