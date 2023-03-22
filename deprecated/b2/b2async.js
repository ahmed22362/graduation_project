const fs = require("fs")
const axios = require("axios")
const multer = require("multer")

async function authenticate(applicationKeyId, applicationKey) {
  const response = await axios.get(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      auth: {
        username: applicationKeyId,
        password: applicationKey,
      },
    }
  )
  return {
    accountId: response.data.accountId,
    apiUrl: response.data.apiUrl,
    authorizationToken: response.data.authorizationToken,
  }
}

async function getBucketId(bucketName, applicationKeyId, applicationKey) {
  const { apiUrl, authorizationToken } = await authenticate(
    applicationKeyId,
    applicationKey
  )

  const response = await axios.post(
    apiUrl + "/b2api/v2/b2_list_buckets",
    {
      accountId: applicationKeyId,
    },
    {
      headers: {
        Authorization: authorizationToken,
      },
    }
  )

  const bucket = response.data.buckets.find((b) => b.bucketName === bucketName)
  const bucketId = bucket.bucketId

  return bucketId
}

async function uploadFile(file, bucketName, applicationKeyId, applicationKey) {
  const fileSize = file.size
  const contentType = file.mimetype
  const sha1 = require("crypto").createHash("sha1")

  const { apiUrl, authorizationToken } = await authenticate(
    applicationKeyId,
    applicationKey
  )
  const bucketId = await getBucketId(
    bucketName,
    applicationKeyId,
    applicationKey
  )

  const uploadUrlResponse = await axios.get(
    apiUrl + "/b2api/v2/b2_get_upload_url",
    {
      headers: {
        Authorization: authorizationToken,
      },
      params: {
        bucketId: bucketId,
      },
    }
  )

  const uploadUrl = uploadUrlResponse.data.uploadUrl
  const uploadAuthToken = uploadUrlResponse.data.authorizationToken

  const headers = {
    Authorization: uploadAuthToken,
    "X-Bz-File-Name": encodeURIComponent(file.originalname),
    "Content-Type": contentType,
    "X-Bz-Content-Sha1": sha1.digest("hex"),
    "Content-Length": fileSize,
  }

  const response = await axios.post(uploadUrl, file.buffer, { headers })

  const fileId = response.data.fileId
  return fileId
}

module.exports = {
  authenticate,
  getBucketId,
  uploadFile,
}
