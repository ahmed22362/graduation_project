const bcrypt = require("bcrypt")

const AppError = require("../../utils/appError")

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: "Username already in use!",
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: "Email address already in use!",
      },
      validate: {
        isEmail: { msg: "Please provide a valid email" },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    passwordConfirm: {
      type: Sequelize.STRING,
      validate: {
        isSame(val) {
          if (val !== this.password) {
            throw new Error("Password conform must be the same as password.")
          }
        },
      },
    },
    role: {
      type: Sequelize.ENUM,
      values: ["user", "employee", "sub-manager", "manager"],
      defaultValue: "user",
    },
    passwordChangedAt: Sequelize.DATE,
    passwordResetToken: Sequelize.STRING,
    passwordResetExpire: Sequelize.DATE,
  })

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  User.beforeSave(async (user, options) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(12)
      user.password = await bcrypt.hash(user.password, salt)
      user.passwordConfirm = undefined
    }
  })

  User.beforeSave(async (user, options) => {
    if (!user.changed("password") || this.isNewRecord) {
    } else user.passwordChangedAt = Date.now() - 1000
  })
  User.prototype.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword)
  }

  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedPasswordSec = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      )
      console.log(changedPasswordSec, JWTTimestamp)
      return JWTTimestamp < changedPasswordSec
    }
    return false
  }
  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    console.log({ resetToken }, { dbResetToken: this.passwordResetToken })
    return resetToken
  }
  return User
}
