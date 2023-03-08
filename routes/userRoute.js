const express = require("express")
const multer = require("multer")

const userController = require("./../controllers/userController")
const authController = require("../controllers/authController")
const router = express.Router()

const upload = multer({ dest: "../uploads/" })

router.post("/signup", upload.single("image"), authController.signup)
router.post("/login", authController.login)
router.post("/forgetPassword", authController.forgetPassword)
router.patch("/resetPassword", authController.resetPassword)
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateUserPassword
)
router.patch("/updateMe", authController.protect, userController.updateMe)
router.delete("/deleteMe", authController.protect, userController.deleteMe)

// router.use(
//   authController.protect,
//   authController.restrictTo("manager", "sub-manager")
// )

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
