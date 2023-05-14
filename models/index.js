const Sequelize = require("sequelize")
const config = require("./../config/dbConfig")
const User = require("./modelTables/userModel")
const Car = require("./modelTables/carModel")
const Employee = require("./modelTables/employeeModel")
const Issue = require("./modelTables/issueModel")
const Shop = require("./modelTables/shopModel")
const Visit = require("./modelTables/visitModel")
const Offer = require("./modelTables/offerModel")
const Movie = require("./modelTables/movieModel")
const Cinema = require("./modelTables/cinemaModel")
const Checkout = require("./joinTables/check_out")
const CinemaMovie = require("./joinTables/cinema_movie")
const UserShop = require("./joinTables/user_shop")
const OfferShop = require("./joinTables/offer_shop")
const EmployeeAttendance = require("./modelTables/employeeAttendanceModel")
const IssueEmployee = require("./joinTables/issue_employee")
const ModelIssueEmployee = require("./../models/joinTables/modelIssue_employee")
const catchAsync = require("../utils/catchAsync")
const ModelIssue = require("./../models/modelTables/modelIssueModel")
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
// const sequelize = new Sequelize(config.ElephantURL, {
//   logging: false,
// })
// connect to render postgres db
// const sequelize = new Sequelize(config.RENDER_POSTGRESQL_graduation, {
//   logging: false,
// })
// Connect with the MS Azure databases
// const sequelize = new Sequelize(
//   config.Azure_db_name,
//   config.Azure_db_user,
//   config.Azure_db_password,
//   {
//     host: config.Azure_host,
//     port: config.Azure_port,
//     dialect: config.dialect,
//     pool: {
//       max: config.pool.max,
//       min: config.pool.min,
//     },
//     ssl: true,
//     dialectOptions: {
//       ssl: {
//         require: true,
//       },
//     },
//     logging: false,
//   }
// )
// Define Database
const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

// Define Tables
db.user = User(sequelize, Sequelize)
db.car = Car(sequelize, Sequelize)
db.employee = Employee(sequelize, Sequelize)
db.issue = Issue(sequelize, Sequelize)
db.shop = Shop(sequelize, Sequelize)
db.visit = Visit(sequelize, Sequelize)
db.offer = Offer(sequelize, Sequelize)
db.movie = Movie(sequelize, Sequelize)
db.cinema = Cinema(sequelize, Sequelize)
db.modelIssue = ModelIssue(sequelize, Sequelize)
db.employeeAttendance = EmployeeAttendance(sequelize, Sequelize)
db.check_out = Checkout(sequelize, Sequelize)
db.user_shop = UserShop(sequelize, Sequelize)
db.cinema_movie = CinemaMovie(sequelize, Sequelize)
db.issue_employee = IssueEmployee(sequelize, Sequelize)
db.modelIssue_employee = ModelIssueEmployee(sequelize, Sequelize)
db.offer_shop = OfferShop(sequelize, Sequelize)
// Define Relation

// 1-M user and issue
db.user.hasMany(db.issue, {
  as: "issue",
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
})
db.issue.belongsTo(db.user, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
})
// 1-M car and visit
db.car.hasMany(db.visit, { as: "visit" })
db.visit.belongsTo(db.car)
// 1-M employee and attendance
db.employee.hasMany(db.employeeAttendance, { as: "attendance" })
db.employeeAttendance.belongsTo(db.employee)

//M-M user and movies
// Apply super many to many read the doc https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#the-best-of-both-worlds-the-super-many-to-many-relationship
db.user.belongsToMany(db.movie, {
  through: db.check_out,
  as: "movie",
  foreignKey: "userId",
  otherKey: "movieId",
  unique: false,
})
db.movie.belongsToMany(db.user, {
  through: db.check_out,
  as: "user",
  foreignKey: "movieId",
  otherKey: "userId",
  unique: false,
})
db.user.hasMany(db.check_out)
db.check_out.belongsTo(db.user)
db.movie.hasMany(db.check_out)
db.check_out.belongsTo(db.movie)
// M-M user and service saved as user visit static data only add and delete
db.user.belongsToMany(db.shop, {
  through: db.user_shop,
  as: "shops",
  foreignKey: "userId",
})
db.shop.belongsToMany(db.user, {
  through: db.user_shop,
  as: "user",
  foreignKey: "shopId",
})
db.user.hasMany(db.user_shop)
db.user_shop.belongsTo(db.user)
db.shop.hasMany(db.user_shop)
db.user_shop.belongsTo(db.shop)
// M-M issue and employee
db.employee.belongsToMany(db.issue, {
  through: db.issue_employee,
  as: "issue",
  foreignKey: "employeeId",
  otherKey: "issueId",
})
db.issue.belongsToMany(db.employee, {
  through: db.issue_employee,
  as: "employee",
  foreignKey: "issueId",
  otherKey: "employeeId",
})
db.employee.hasMany(db.issue_employee)
db.issue_employee.belongsTo(db.employee)
db.issue.hasMany(db.issue_employee)
db.issue_employee.belongsTo(db.issue)
// M-M model issue and employee
db.employee.belongsToMany(db.modelIssue, {
  through: db.modelIssue_employee,
  as: "modelIssues",
  foreignKey: "employeeId",
  otherKey: "modelIssueId",
})
db.modelIssue.belongsToMany(db.employee, {
  through: db.modelIssue_employee,
  as: "employee",
  foreignKey: "modelIssueId",
  otherKey: "employeeId",
})
db.employee.hasMany(db.modelIssue_employee)
db.modelIssue_employee.belongsTo(db.employee)
db.modelIssue.hasMany(db.modelIssue_employee)
db.modelIssue_employee.belongsTo(db.modelIssue)
// M-M shop offer
db.shop.belongsToMany(db.offer, {
  through: db.offer_shop,
  as: "offer",
})
db.offer.belongsToMany(db.shop, {
  through: db.offer_shop,
  as: "shop",
})
db.shop.hasMany(db.offer_shop)
db.offer_shop.belongsTo(db.shop)
db.offer.hasMany(db.offer_shop)
db.offer_shop.belongsTo(db.offer)

// M-M cinema movie
db.cinema.belongsToMany(db.movie, { through: db.cinema_movie, as: "movie" })
db.movie.belongsToMany(db.cinema, { through: db.cinema_movie, as: "cinema" })
db.cinema.hasMany(db.cinema_movie)
db.cinema_movie.belongsTo(db.cinema)
db.movie.hasMany(db.cinema_movie)
db.cinema_movie.belongsTo(db.movie)

db.ROLES = ["user", "admin", "moderator"]
db.SERVICES_TYPE = ["restaurant", "store", "entertainment"]
db.ISSUE_STATE = ["done", "need help"]
db.SERVICES_STATE = ["done", "pending"]
const data = catchAsync(async () => {
  await db.car.create({ plateNum: "123abc", color: "red" })
})
// data()
module.exports = db
