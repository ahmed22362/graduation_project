module.exports = (sequelize, Sequelize) => {
  const Issue = sequelize.define(
    "issue",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      location: Sequelize.STRING,
      contact_method: Sequelize.STRING,
      details: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
      state: {
        type: Sequelize.ENUM,
        values: ["found", "not found"],
        defaultValue: "not found",
      },
    },
    { timestamps: true, freezeTableName: true }
  )

  return Issue
}
