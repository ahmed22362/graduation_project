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
const Offer = require("./modelTables/offerModel")
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
db.offer = Offer(sequelize, Sequelize)
db.user_issue = UserIssue(sequelize, Sequelize)
db.user_service = UserService(sequelize, Sequelize)
db.issue_employee = IssueEmployees(sequelize, Sequelize)
// Define Relation

// 1-M user and car
db.user.hasMany(db.car, { as: "cars" })
db.car.belongsTo(db.user)
// 1-M car and visit
db.car.hasMany(db.visit, { as: "visits" })
db.visit.belongsTo(db.car)
// 1-M offer and service
db.offer.hasMany(db.service, { as: "services" })
db.service.belongsTo(db.offer, { foreignKey: { allowNull: true } })
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
const data = catchAsync(async () => {})
const deletee = catchAsync(async () => {
  await db.user.destroy({
    where: { email: "admin@gmail.com" },
  })
})
// data()
// deletee()
module.exports = db
