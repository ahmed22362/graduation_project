module.exports = (sequelize, Sequelize) => {
  const ModelIssue = sequelize.define(
    "modelIssue",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      type: Sequelize.STRING,
      details: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
      state: {
        type: Sequelize.ENUM,
        values: ["pending", "done", "need help"],
        defaultValue: "pending",
      },
    },
    { timestamps: true, freezeTableName: true }
  )
  return ModelIssue
}
