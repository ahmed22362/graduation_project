const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudConfig = require("../config/cloudinaryConfig")
// Configuration
cloudinary.config({
  cloud_name: cloudConfig.cloud_name,
  api_key: cloudConfig.api_key,
  api_secret: cloudConfig.api_secret,
})

// Create Cloudinary storage object
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "photos/user",
    allowed_formats: ["jpg", "png"],
  },
})
const gStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gFolder/asset",
    allowed_formats: ["jpg", "png"],
  },
})
const uploadImage = async (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
const storage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "png"],
    },
  })
}
module.exports = { gStorage, userStorage, uploadImage, storage }
