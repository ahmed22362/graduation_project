module.exports = (sequelize, Sequelize) => {
  const Movie = sequelize.define(
    "movie",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING },
      duration: Sequelize.INTEGER,
      release: Sequelize.DATEONLY,
      description: Sequelize.STRING,
      genre: Sequelize.STRING,
      time: Sequelize.TIME,
      ticketPrice: Sequelize.DOUBLE,
    },
    { timestamps: false, freezeTableName: true }
  )
  return Movie
}
