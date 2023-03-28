const express = require("express")
const multer = require("multer")

const userController = require("./../controllers/userController")
const authController = require("../controllers/authController")
const storage = require("../utils/cloudinary")

const router = express.Router()

const upload = multer({ storage: storage })

router.post("/signup", upload.single("image"), authController.signup)
router.post("/login", authController.login)
router.post("/forgetPassword", authController.forgetPassword)
router.patch("/resetPassword", authController.resetPassword)
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateUserPassword
)
router.patch(
  "/updateMe",
  upload.single("image"),
  authController.protect,
  userController.updateMe
)
router.delete("/deleteMe", authController.protect, userController.deleteMe)
router.patch("/addCar", authController.protect, userController.userAddCar)
router
  .route("/user-visit")
  .post(authController.protect, userController.addToUserVisit)
  .get(authController.protect, userController.getUserVisit)
  .delete(authController.protect, userController.removeFromUserVisit)
router.route("/checkout").get()
// router.use(
//   authController.protect,
//   authController.restrictTo("manager", "sub-manager")
// )

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById)

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
module.exports = router
