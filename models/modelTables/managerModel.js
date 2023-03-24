module.exports = (sequelize, Sequelize) => {
  const Manager = sequelize.define(
    "manager",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Manager
}
