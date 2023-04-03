module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define(
    "employee",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      role: {
        type: Sequelize.ENUM,
        values: ["employee", "sub-manager"],
        defaultValue: "employee",
      },
    },
    { timestamps: false, freezeTableName: true }
  )
  return Employee
}
