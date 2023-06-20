module.exports = (sequelize, Sequelize) => {
  const cinema_movie = sequelize.define(
    "movie_party",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return cinema_movie
}
