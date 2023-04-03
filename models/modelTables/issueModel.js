module.exports = (sequelize, Sequelize) => {
  const Issue = sequelize.define(
    "issue",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      type: Sequelize.STRING,
      details: Sequelize.STRING,
      image: Sequelize.STRING,
      state: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "need help"],
        defaultValue: "pending",
      },
    },
    { timestamps: true, freezeTableName: true }
  )
  return Issue
}
