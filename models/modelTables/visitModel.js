module.exports = (sequelize, Sequelize) => {
  const Visit = sequelize.define(
    "visit",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      timeIn: Sequelize.STRING,
      timeOut: Sequelize.STRING,
      section: Sequelize.INTEGER,
      cost: Sequelize.FLOAT,
    },
    { timestamps: false, freezeTableName: true }
  )

  return Visit
}
