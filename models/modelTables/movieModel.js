module.exports = (sequelize, Sequelize) => {
  const Movie = sequelize.define(
    "movie",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      duration: Sequelize.INTEGER,
      release: Sequelize.DATEONLY,
      description: Sequelize.STRING,
      genre: { type: Sequelize.STRING, allowNull: false },
      time: Sequelize.TIME,
      ticketPrice: { type: Sequelize.DOUBLE, allowNull: false },
      imageUrl: Sequelize.STRING,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Movie
}
