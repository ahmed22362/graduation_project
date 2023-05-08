module.exports = (sequelize, Sequelize) => {
  const Shop = sequelize.define(
    "shop",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      location: Sequelize.STRING,
      openAt: Sequelize.INTEGER,
      closeAt: Sequelize.INTEGER,
      phone: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
      shopType: {
        type: Sequelize.ENUM,
        values: ["shop", "restaurant", "entreatment"],
        defaultValue: "shop",
      },
    },
    { timestamps: false, freezeTableName: true }
  )
  return Shop
}
