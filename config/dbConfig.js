module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "22362",
  DB: "db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
