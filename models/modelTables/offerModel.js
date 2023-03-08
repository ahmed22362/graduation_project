module.exports = (sequelize, Sequelize) => {
  const offer = sequelize.define(
    "Offer",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      duration: Sequelize.INTEGER,
      discount: Sequelize.DOUBLE,
    },
    { timestamps: false }
  )
  return offer
}
