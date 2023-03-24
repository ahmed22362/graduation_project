module.exports = (sequelize, Sequelize) => {
  const User_Issue = sequelize.define(
    "user_issue",
    {
      details: Sequelize.STRING,
      image: Sequelize.STRING,
    },
    { timestamps: true, freezeTableName: true }
  )
  return User_Issue
}
