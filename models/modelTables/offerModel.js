module.exports = (sequelize, Sequelize) => {
  const offer = sequelize.define(
    "offer",
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
    { timestamps: false, freezeTableName: true }
  )
  return offer
}
