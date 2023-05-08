module.exports = (sequelize, Sequelize) => {
  const Visit = sequelize.define(
    "visit",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      timeIn: Sequelize.DATE,
      timeOut: Sequelize.DATE,
      section: Sequelize.INTEGER,
      cost: Sequelize.FLOAT,
    },
    { timestamps: false, freezeTableName: true }
  )

  return Visit
}
