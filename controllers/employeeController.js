const db = require("./../models/index")
const factory = require("./factoryHandler")
const Employee = db.employee

exports.getAll = factory.getAll(Employee, {})
exports.getEmployee = factory.getOne(Employee, {
  exclude: ["password"],
})
exports.updateEmployee = factory.updateOne(Employee)
exports.delete = factory.deleteOne(Employee)
exports.addEmployee = factory.createOne(Employee)
