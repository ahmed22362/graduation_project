// routes/auth.js

const express = require("express")
const { check, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/modelTables/userModel")
const router = express.Router()

router.get("/register", (req, res) => {
  res.render("register")
})

router.post(
  "/register",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    check("password_confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password")
      }
      return true
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("register", { errors: errors.array() })
    }

    try {
      const { username, email, password } = req.body

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.render("register", {
          errors: [{ msg: "User already exists with that email" }],
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      })

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

      res.cookie("jwt", token, { httpOnly: true })
      res.redirect("/")
    } catch (err) {
      console.log(err)
      return res.render("register", {
        errors: [{ msg: "Registration failed. Please try again." }],
      })
    }
  }
)

router.get("/login", (req, res) => {
  res.render("login")
})

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Email is invalid"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("login", { errors: errors.array() })
    }

    try {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.render("login", {
          errors: [{ msg: "Invalid email or password" }],
        })
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return res.render("login", {
          errors: [{ msg: "Invalid email or password" }],
        })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

      res.cookie("jwt", token, { httpOnly: true })
      res.redirect("/")
    } catch (err) {
      console.log(err)
      return res.render("login", {
        errors: [{ msg: "Login failed. Please try again." }],
      })
    }
  }
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
})

module.exports = router
