module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "role",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      role: {
        type: Sequelize.ENUM,
        values: ["employee", "sub-manager", "manager"],
        defaultValue: "employee",
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  )
  return Role
}
