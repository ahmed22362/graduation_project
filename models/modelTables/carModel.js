module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define(
    "Car",
    {
      plateNum: { type: Sequelize.STRING, primaryKey: true },
      color: Sequelize.STRING,
    },
    { timestamps: false }
  )
  return Car
}
