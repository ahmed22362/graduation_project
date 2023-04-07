module.exports = (sequelize, Sequelize) => {
  const modelIssue_employee = sequelize.define(
    "modelIssue_employee",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return modelIssue_employee
}
