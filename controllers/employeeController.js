const db = require("./../models/index")
const factory = require("./factoryHandler")
const authController = require("./authController")
const catchAsync = require("./../utils/catchAsync")
const initObj = require("./../config/initObj")
const AppError = require("../utils/appError")
const { Op } = require("sequelize")

const Employee = db.employee
const EmployeeAttendance = db.employeeAttendance

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

// attendance
exports.getAllAttendance = factory.getAll(EmployeeAttendance)
exports.attendance = catchAsync(async (req, res, next) => {
  const name = req.body.name
  const loggedIn = req.body.loggedIn
  const loggedOut = req.body.loggedOut
  console.log(name, loggedIn, loggedOut)
  if (!name) {
    return next(new AppError("please provide name of the employee", 400))
  }
  if (loggedIn == null && loggedOut == null) {
    return next(
      new AppError("please provide the attendance of the employee", 400)
    )
  }
  const employee = await Employee.findOne({ where: { name } })
  if (!employee) {
    return next(new AppError("there is no employee with this name", 404))
  }
  let data
  if (loggedOut == null) {
    data = await logIn(employee, loggedIn, next)
  } else {
    data = await logOut(employee, loggedOut, next)
  }
  if (data) {
    res.status(200).json({ status: "success", data })
  }
})
exports.getEmployeeAttendance = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("please provide id in parameters", 400))
  }
  const employee = await Employee.findByPk(req.params.id)
  if (!employee) {
    return next(new AppError("there is no employee with this id", 404))
  }
  const attendance = await EmployeeAttendance.findAll({
    where: { employeeId: req.params.id },
  })
  res.status(200).json({ status: "success", data: attendance })
})
// function to handel log in
const logIn = async (employee, logIn, next) => {
  const check = await EmployeeAttendance.findOne({
    where: {
      employeeId: employee.id,
      loggedIn: { [Op.not]: null },
      loggedOut: null,
    },
  })
  if (check) {
    return next(new AppError("employee already loggedIn!", 400))
  }
  return await EmployeeAttendance.create({
    loggedIn: logIn,
    employeeId: employee.id,
  })
}
// function to handel logout
const logOut = async (employee, loggedOut, next) => {
  const check = await EmployeeAttendance.findOne({
    where: {
      employeeId: employee.id,
      loggedIn: { [Op.not]: null },
      loggedOut: null,
    },
  })
  if (!check) {
    return next(new AppError("There are no logged employee with this name"))
  }
  return await EmployeeAttendance.update(
    {
      loggedOut,
    },
    {
      where: {
        employeeId: employee.id,
        loggedOut: { [Op.eq]: null },
        loggedIn: { [Op.not]: null },
      },
      returning: true,
    }
  )
}
