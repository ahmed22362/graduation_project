const admin = require("firebase-admin")

// Load your Firebase service account key JSON file
const serviceAccount = require("./../config/graduation-project-e8f21-firebase-adminsdk-3sp6q-5e63ddee54.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

async function sendNotificationToDevice(deviceToken, title, body) {
  const message = {
    token: deviceToken,
    notification: {
      title: title,
      body: body,
    },
  }

  try {
    const response = await admin.messaging().send(message)
    console.log("Notification sent successfully:", response)
  } catch (error) {
    console.error("Error sending notification:", error)
  }
}

module.exports = sendNotificationToDevice
