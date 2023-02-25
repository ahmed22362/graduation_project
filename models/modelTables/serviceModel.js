module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define(
    "Service",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      type: Sequelize.STRING,
      stock: Sequelize.INTEGER,
      details: Sequelize.STRING,
      name: Sequelize.STRING,
    },
    { timestamps: false }
  )
  return Service
}
