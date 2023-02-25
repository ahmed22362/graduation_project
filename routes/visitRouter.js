const app = require("express")
const router = app.Router()
router.route("/").get().post()
router.route("/:id").get().patch().delete()
module.exports = router
