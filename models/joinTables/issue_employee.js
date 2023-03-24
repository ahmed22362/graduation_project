module.exports = (sequelize, Sequelize) => {
  const Issue_Employee = sequelize.define(
    "issue_employee",
    {
      state: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "need help"],
        defaultValue: "pending",
      },
    },
    { timestamps: false, freezeTableName: true }
  )
  return Issue_Employee
}
