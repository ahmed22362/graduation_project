module.exports = (sequelize, Sequelize) => {
  const cinema_movie = sequelize.define(
    "cinema_movie",
    {},
    { timestamps: false, freezeTableName: true }
  )
  return cinema_movie
}
