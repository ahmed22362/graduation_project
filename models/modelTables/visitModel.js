module.exports = (sequelize, Sequelize) => {
  const Visit = sequelize.define(
    "Visit",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      timeIn: Sequelize.DATE,
      timeOut: Sequelize.DATE,
      section: Sequelize.STRING,
      cost: Sequelize.FLOAT,
    },
    { timestamps: false }
  )
  return Visit
}
