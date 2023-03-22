module.exports = (sequelize, Sequelize) => {
  const CheckOut = sequelize.define(
    "CheckOut",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "done"],
        defaultValue: "pending",
      },
      cost: Sequelize.FLOAT,
    },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false,
      freezeTableName: true,
    }
  )
  return CheckOut
}
