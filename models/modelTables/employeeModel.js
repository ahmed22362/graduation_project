module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
    },
    { timestamps: false }
  )
  return Employee
}
