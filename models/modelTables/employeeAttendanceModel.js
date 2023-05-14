module.exports = (sequelize, Sequelize) => {
  const EmployeeAttendance = sequelize.define(
    "employeeAttendance",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      loggedIn: {
        type: Sequelize.DATE,
      },
      loggedOut: {
        type: Sequelize.DATE,
      },
    },
    { timestamps: true, freezeTableName: true }
  )
  return EmployeeAttendance
}
