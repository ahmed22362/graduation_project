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
      discount: { type: Sequelize.DOUBLE, allowNull: false },
      startAt: Sequelize.DATE,
      endAt: Sequelize.DATE,
    },
    { timestamps: false, freezeTableName: true }
  )
  return offer
}
