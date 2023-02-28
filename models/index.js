const Sequelize = require("sequelize")
const config = require("./../config/dbConfig")
const User = require("./modelTables/userModel")
const Role = require("./modelTables/roleModel")
const Car = require("./modelTables/carModel")
const Employee = require("./modelTables/employeeModel")
const Issue = require("./modelTables/issueModel")
const Manager = require("./modelTables/managerModel")
const Service = require("./modelTables/serviceModel")
const Visit = require("./modelTables/visitModel")
const IssueEmployees = require("./joinTables/issue_employee")
const UserIssue = require("./joinTables/user_issue")
const UserService = require("./joinTables/user_service")
const catchAsync = require("../utils/catchAsync")

// Connect with the local databases
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
  },
  logging: false,
})
// Define Database
const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

// Define Tables
db.role = Role(sequelize, Sequelize)
db.user = User(sequelize, Sequelize)
db.car = Car(sequelize, Sequelize)
db.employee = Employee(sequelize, Sequelize)
db.issue = Issue(sequelize, Sequelize)
db.manager = Manager(sequelize, Sequelize)
db.service = Service(sequelize, Sequelize)
db.visit = Visit(sequelize, Sequelize)
db.user_issue = UserIssue(sequelize, Sequelize)
db.user_service = UserService(sequelize, Sequelize)
db.issue_employee = IssueEmployees(sequelize, Sequelize)
// Define Relation

// 1-M user and car
db.user.hasMany(db.car)
db.car.belongsTo(db.user)
// 1-M car and visit
db.car.hasMany(db.visit)
db.visit.belongsTo(db.car)
// M-M user and issue
db.user.belongsToMany(db.issue, {
  through: db.user_issue,
  foreignKey: "userId",
  otherKey: "issueId",
})
db.issue.belongsToMany(db.user, {
  through: db.user_issue,
  foreignKey: "issueId",
  otherKey: "userId",
  unique: false,
})
//M-M user and service
db.user.belongsToMany(db.service, {
  through: db.user_service,
  foreignKey: "userId",
  otherKey: "serviceId",
  unique: false,
})
db.service.belongsToMany(db.user, {
  through: db.user_service,
  foreignKey: "serviceId",
  otherKey: "userId",
  unique: false,
})
// M-M issue and employee
db.employee.belongsToMany(db.issue, {
  through: db.issue_employee,
  foreignKey: "employeeId",
  otherKey: "issueId",
})
db.issue.belongsToMany(db.employee, {
  through: db.issue_employee,
  foreignKey: "issueId",
  otherKey: "employeeId",
})
//--------------------------------------------
db.role.belongsToMany(db.user, {
  through: "user_role",
  foreignKey: "roleId",
  otherKey: "userId",
})

db.user.belongsToMany(db.role, {
  through: "user_role",
  foreignKey: "user_id",
  otherKey: "roleId",
})
db.ROLES = ["user", "admin", "moderator"]
db.ISSUE_STATE = ["done", "need help"]
const data = catchAsync(async () => {
  try {
    const visit = await db.visit.create({
      cost: 39,
      CarPlateNum: "123abc",
    })
  } catch (error) {
    console.log(`here from logic: ${error.name}`)
  }
  const cars = await db.car.findAll({ attributes: ["color", "plateNum"] })
  const data = JSON.parse(JSON.stringify(cars))
  const visits = await db.visit.findAll({ where: { CarPlateNum: "343dfs" } })
  console.log(data[0].plateNum, JSON.parse(JSON.stringify(visits))[1])
})
const deletee = catchAsync(async () => {
  await db.user.destroy({
    where: { email: "admin@gmail.com" },
  })
})
// data()
// deletee()
module.exports = db
