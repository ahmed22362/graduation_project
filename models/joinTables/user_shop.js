module.exports = (sequelize, Sequelize) => {
  const user_shop = sequelize.define(
    "user_shop",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return user_shop
}
