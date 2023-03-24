module.exports = (sequelize, Sequelize) => {
  const Manager = sequelize.define(
    "Manager",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Manager
}
