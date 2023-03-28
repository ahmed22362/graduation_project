const User = require("../modelTables/userModel")
const Service = require("../modelTables/serviceModel")
module.exports = (sequelize, Sequelize) => {
  const User_Service = sequelize.define(
    "user_service",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  )
  return User_Service
}
