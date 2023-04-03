module.exports = (sequelize, Sequelize) => {
  const issue_employee = sequelize.define(
    "issue_employee",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return issue_employee
}
