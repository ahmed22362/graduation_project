const fs = require("fs")
const axios = require("axios")
const config = require("../b2Config")

function authenticate(accountId, applicationKey) {
  const encodedBase64 = new Buffer.from(
    accountId + ":" + applicationKey
  ).toString("base64")
  return axios
    .post(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {},
      {
        headers: { Authorization: "Basic " + encodedBase64 },
      }
    )
    .then((response) => {
      const authToken = response.data.authorizationToken
      const apiUrl = response.data.apiUrl
      const downloadUrl = response.data.downloadUrl
      return {
        authToken: authToken,
        apiUrl: apiUrl,
        downloadUrl: downloadUrl,
      }
    })
    .catch((err) => {
      return err
    })
}

function getBucketId(bucketName, accountId, applicationKey) {
  return authenticate(accountId, applicationKey)
    .then((authData) => {
      const authToken = authData.authToken
      const apiUrl = authData.apiUrl

      return axios.get(apiUrl + "/b2api/v2/b2_list_buckets", {
        headers: {
          Authorization: authToken,
        },
      })
    })
    .then((response) => {
      const bucket = response.data.buckets.find(
        (b) => b.bucketName === bucketName
      )
      if (bucket) {
        return bucket.bucketId
      } else {
        throw new Error(`Bucket ${bucketName} not found`)
      }
    })
}

function uploadFile(file, bucketName, accountId, applicationKey) {
  const fileSize = file.size
  const contentType = file.mimetype
  const sha1 = require("crypto").createHash("sha1")

  const apiUrlPromise = authenticate(accountId, applicationKey).then(
    (authData) => authData.apiUrl
  )

  const uploadUrlPromise = axios
    .get(apiUrlPromise + "/b2api/v2/b2_get_upload_url", {
      headers: {
        Authorization: authToken,
      },
      params: {
        bucketId: bucketId,
      },
    })
    .then((response) => response.data)

  return Promise.all([apiUrlPromise, uploadUrlPromise])
    .then(([apiUrl, uploadUrlData]) => {
      const uploadUrl = uploadUrlData.uploadUrl
      const uploadAuthToken = uploadUrlData.authorizationToken

      const headers = {
        Authorization: uploadAuthToken,
        "X-Bz-File-Name": encodeURIComponent(file.originalname),
        "Content-Type": contentType,
        "X-Bz-Content-Sha1": sha1.digest("hex"),
        "Content-Length": fileSize,
      }

      return axios.post(uploadUrl, file.buffer, { headers })
    })
    .then((response) => {
      const fileId = response.data.fileId
      return fileId
    })
}
authenticate(config.B2_ACCOUNT_ID, config.B2_APPLICATION_KEY)
module.exports = {
  authenticate,
  getBucketId,
  uploadFile,
}
