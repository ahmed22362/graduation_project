module.exports = (sequelize, Sequelize) => {
  const user_issue = sequelize.define(
    "user_issue",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return user_issue
}
