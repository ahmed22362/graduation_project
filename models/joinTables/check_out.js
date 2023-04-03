module.exports = (sequelize, Sequelize) => {
  const Checkout = sequelize.define(
    "checkout",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "done"],
        defaultValue: "pending",
      },
      ticketPrice: Sequelize.FLOAT,
      ticketNum: Sequelize.INTEGER,
      cost: Sequelize.FLOAT,
    },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false,
      freezeTableName: true,
    }
  )

  return Checkout
}
