module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define(
    "car",
    {
      plateNum: { type: Sequelize.STRING, primaryKey: true },
      color: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Car
}
