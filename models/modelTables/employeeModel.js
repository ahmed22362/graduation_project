const bcrypt = require("bcrypt")
const crypto = require("crypto")

module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define(
    "employee",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: "Email address already in use!",
        },
        validate: {
          isEmail: { msg: "Please provide a valid email" },
        },
      },
      password: Sequelize.STRING,
      role: {
        type: Sequelize.ENUM,
        values: ["employee", "sub-manager", "manager", "model"],
        defaultValue: "employee",
      },
    },
    { timestamps: false, freezeTableName: true }
  )

  Employee.beforeSave(async (employee, options) => {
    if (employee.changed("password")) {
      const salt = await bcrypt.genSalt(12)
      employee.password = await bcrypt.hash(employee.password, salt)
    }
  })

  Employee.prototype.correctPassword = async function (
    candidatePassword,
    employeePassword
  ) {
    return await bcrypt.compare(candidatePassword, employeePassword)
  }
  return Employee
}
