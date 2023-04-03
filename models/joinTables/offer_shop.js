module.exports = (sequelize, Sequelize) => {
  const offer_shop = sequelize.define(
    "offer_shop",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return offer_shop
}
