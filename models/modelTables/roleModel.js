module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
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
