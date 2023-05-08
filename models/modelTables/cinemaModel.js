module.exports = (sequelize, Sequelize) => {
  const Cinema = sequelize.define(
    "cinema",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      openAt: Sequelize.INTEGER,
      closeAt: Sequelize.INTEGER,
      phone: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Cinema
}
