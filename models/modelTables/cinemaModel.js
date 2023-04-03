module.exports = (sequelize, Sequelize) => {
  const Cinema = sequelize.define(
    "cinema",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      location: Sequelize.STRING,
      openAt: Sequelize.INTEGER,
      closeAt: Sequelize.INTEGER,
      phone: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Cinema
}
