const { B2 } = require("backblaze-b2")
const fs = require("fs")
const path = require("path")
const stream = require("stream")

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
})

async function uploadToB2(file) {
  const { createReadStream, filename } = await file
  const readStream = createReadStream()
  const passThrough = new stream.PassThrough()
  readStream.pipe(passThrough)

  const bucketId = process.env.B2_BUCKET_ID
  const uploadFileName = `${Date.now()}-${filename}`

  const [uploadUrl, uploadAuthToken] = await b2.getUploadUrl({
    bucketId,
  })

  const { data } = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken,
    filename: uploadFileName,
    mime: "image/jpeg",
    data: passThrough,
  })

  const imageUrl = `https://f001.backblazeb2.com/file/${bucketId}/${uploadFileName}`
  return imageUrl
}

module.exports = uploadToB2
