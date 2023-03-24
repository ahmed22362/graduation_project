module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define(
    "serviceType",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      type: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Service
}
