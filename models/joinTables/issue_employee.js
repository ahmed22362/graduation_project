module.exports = (sequelize, Sequelize) => {
  const Issue_Employee = sequelize.define(
    "Issue_Employee",
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
