module.exports = (sequelize, Sequelize) => {
  const Issue = sequelize.define(
    "Issue",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      type: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Issue
}
