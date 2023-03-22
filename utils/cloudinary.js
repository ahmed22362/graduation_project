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
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gFolder",
    allowed_formats: ["jpg", "png"],
    public_id: (req, file) => file.originalname,
  },
})

module.exports = storage
