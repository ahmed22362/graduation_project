const bcrypt = require("bcrypt")

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Username already in use!",
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
        validate: {
          isEmail: { args: true, msg: "Please provide a valid email" },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        },
      },
    }
  )

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  return User
}
