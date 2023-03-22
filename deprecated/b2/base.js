const b2 = require("./b2")
const b2async = require("./b2async")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const config = require("../b2Config")

const accountId = config.B2_ACCOUNT_ID
const applicationKey = config.B2_APPLICATION_KEY
const bucketName = "graduation_data"
const d = async () => {
  const t = await b2async.authenticate(accountId, applicationKey)
  console.log(t)
}
d()
