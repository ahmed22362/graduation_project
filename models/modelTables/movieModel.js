module.exports = (sequelize, Sequelize) => {
  const Movie = sequelize.define(
    "Movie",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, primaryKey: true },
      duration: Sequelize.INTEGER,
      release: Sequelize.DATEONLY,
      description: Sequelize.STRING,
      genre: Sequelize.STRING,
      time: Sequelize.TIME,
      ticketPrice: Sequelize.DOUBLE,
    },
    { timestamps: false }
  )
  return Movie
}
