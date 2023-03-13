module.exports = (sequelize, Sequelize) => {
  const Visit = sequelize.define(
    "Visit",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      timeIn: Sequelize.STRING,
      timeOut: Sequelize.STRING,
      section: Sequelize.INTEGER,
      cost: Sequelize.FLOAT,
    },
    { timestamps: false }
  )

  return Visit
}
