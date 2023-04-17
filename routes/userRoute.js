const express = require("express")
const multer = require("multer")

const userController = require("./../controllers/userController")
const authController = require("../controllers/authController")
const checkoutController = require("../controllers/checkoutController")
const storage = require("../utils/cloudinary")
const db = require("./../models/index")
const User = db.user
const router = express.Router()

const upload = multer({ storage: storage })

router.post("/signup", authController.signup(User))
router.post("/login", authController.login(User))
router.post("/forgetPassword", authController.forgetPassword(User))
router.patch("/resetPassword", authController.resetPassword(User))
router.patch(
  "/updateMyPassword",
  authController.protect(User),
  authController.updateUserPassword(User)
)

router.get(
  "/me",
  authController.protect(User),
  userController.getMe,
  userController.getUser
)
router.patch(
  "/updateMe",
  upload.single("image"),
  authController.protect,
  userController.updateMe
)
router.delete(
  "/deleteMe",
  authController.protect,
  userController.getMe,
  userController.deleteUserById
)
router
  .route("/user-visit")
  .all(authController.protect)
  .post(userController.addToUserVisit)
  .get(userController.getUserVisit)
  .delete(userController.removeFromUserVisit)
router
  .route("/checkout")
  .all(authController.protect)
  .get(checkoutController.getCheckOut)
  .post(checkoutController.addToCheckout)
  .delete(checkoutController.removeFromCheckout)
router.patch(
  "/checkout/:id",
  authController.protect,
  checkoutController.updateCheckoutStatus
)
// router.use(
//   authController.protect,
//   authController.restrictTo("manager", "sub-manager")
// )

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById)

router.route("/").get(userController.getAllUsers)
// .post(userController.createUser)

module.exports = router
