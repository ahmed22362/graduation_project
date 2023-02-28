const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  // Define the transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "malachi.bahringer40@ethereal.email",
      pass: "M3jfeWKDDYJF2PeMuV",
    },
  })
  // 2) Define the email options
  const mailOptions = {
    from: "Ahmed Hamada <hello@makhlouf.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  }

  // 3) Actually send the email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
