const express = require("express")
const multer = require("multer")

const userController = require("./../controllers/userController")
const checkoutController = require("../controllers/checkoutController")
const { userStorage } = require("../utils/cloudinary")
const router = express.Router()

const upload = multer({ storage: userStorage })

router.post("/signup", upload.single("image"), userController.signUpUser)
router.post("/login", userController.logInUser)
router.post("/forgetPassword", userController.forgetPasswordUser)
router.patch("/resetPassword", userController.resetPasswordUser)
router.patch(
  "/updateMyPassword",
  userController.protectUser,
  userController.updateMyPasswordUser
)

router.get(
  "/me",
  userController.protectUser,
  userController.getMe,
  userController.getUser
)
router.patch(
  "/updateMe",
  upload.single("image"),
  userController.protectUser,
  userController.updateMe
)
router.delete(
  "/deleteMe",
  userController.protectUser,
  userController.getMe,
  userController.deleteUserById
)
router
  .route("/user-visit")
  .all(userController.protectUser)
  .post(userController.addToUserVisit)
  .get(userController.getUserVisit)
  .delete(userController.removeFromUserVisit)
router
  .route("/checkout")
  .all(userController.protectUser)
  .get(checkoutController.getCheckOut)
  .post(checkoutController.addToCheckout)
  .delete(checkoutController.removeFromCheckout)
router.patch(
  "/checkout/:id",
  userController.protectUser,
  checkoutController.updateCheckoutStatus
)
// router.use(
//   userController.protectUser,
//   authController.restrictTo("manager", "sub-manager")
// )

router
  .route("/:id")
  .get(userController.getUser)
  .patch(upload.single("image"), userController.updateUserById)
  .delete(userController.deleteUserById)

router.route("/").get(userController.getAllUsers)
// .post(userController.createUser)

module.exports = router
