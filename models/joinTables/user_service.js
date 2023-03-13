module.exports = (sequelize, Sequelize) => {
  const User_Service = sequelize.define(
    "User_Service",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status: Sequelize.STRING,
      cost: Sequelize.FLOAT,
    },
    { timestamps: true, createdAt: true, updatedAt: false }
  )
  return User_Service
}
