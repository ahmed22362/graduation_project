module.exports = (sequelize, Sequelize) => {
  const Issue_Employee = sequelize.define(
    "Issue_Employee",
    {
      state: Sequelize.STRING,
    },
    { timestamps: false }
  )
  return Issue_Employee
}
