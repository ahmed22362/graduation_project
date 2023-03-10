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
const ServiceType = require("./modelTables/servicesTypes")
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
// Connect to elephantSql server for postgres
// const sequelize = new Sequelize(
//   "postgres://gwogfwbh:boH4Wk3Oih_AvcvkBvwAFMg6j0tK0N-1@mouse.db.elephantsql.com/gwogfwbh",
//   { logging: false }
// )

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
db.service_type = ServiceType(sequelize, Sequelize)
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
// 1-M service and service type
db.service_type.hasMany(db.service, { as: "services" })
db.service.belongsTo(db.service_type)

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
// M-M employee role
db.role.belongsToMany(db.employee, {
  through: "employee_role",
  foreignKey: "roleId",
  otherKey: "employeeId",
})

db.employee.belongsToMany(db.role, {
  through: "employee_role",
  foreignKey: "employeeId",
  otherKey: "roleId",
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
db.SERVICES_TYPE = ["restaurant", "store", "entertainment"]
db.ISSUE_STATE = ["done", "need help"]
db.SERVICES_STATE = ["done", "pending"]
const data = catchAsync(async () => {
  await db.car.create({ plateNum: "123abc", color: "red" })
})

const createTypes = catchAsync(async () => {
  await db.service_type.bulkCreate([
    { type: "restaurant" },
    { type: "store" },
    { type: "entertainment" },
  ])
})

const createServices = catchAsync(async () => {
  await db.service.bulkCreate([
    {
      ServiceTypeId: 1,
      name: "KFC",
      location: "Third floor",
      openAt: 8,
      closeAt: 8,
      phone: 010,
    },
    {
      ServiceTypeId: 2,
      name: "Men's Club",
      location: "Second floor",
      openAt: 8,
      closeAt: 8,
      phone: 010,
    },
    {
      ServiceTypeId: 3,
      name: "8D Cinema",
      location: "Third floor",
      openAt: 8,
      closeAt: 8,
      phone: 010,
    },
    {
      ServiceTypeId: 1,
      name: "Crinkle",
      location: "Third floor",
      openAt: 8,
      closeAt: 8,
      phone: 010,
    },
  ])
  await db.service.create({
    ServiceTypeId: 1,
    name: "KFC",
    location: "Third floor",
    openAt: 8,
    closeAt: 8,
    phone: 010,
  })
})
const findAllRest = catchAsync(async () => {
  const aw = await db.service_type.findOne({
    where: {
      type: "restaurant",
    },
    include: "services",
  })
  console.log(JSON.stringify(aw))
})
// createTypes()
// createServices()
// findAllRest()
// data()
module.exports = db
