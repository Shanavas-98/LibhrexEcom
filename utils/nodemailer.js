const nodemailer = require('nodemailer');
require('dotenv').config()

const sendVerifyEmail = async (userEmail, otp) => {

    const mailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    const message = {
        from: "Libhrex Ecom",
        to: userEmail,
        subject: "Email Verification OTP",
        text: `Welcome to Libhrex.Your OTP code is ${otp}. 
        Please enter this code to verify your email address.
        Note:OTP valid only for 10 minutes`,
        html: `<p>Welcome to <strong> Libhrex </strong>.<br>
        Your OTP code is <strong>${otp}</strong>.
         Please enter this code to verify your email address.<br>
         <b>Note:</b>OTP valid only for <b>10</b> minutes</p>`
    }

    const info = await mailTransporter.sendMail(message, (err) => {
        if (err) {
            console.log("Sending email failed", err);
        } else {
            console.log("Email sent successfully", info.messageId);
        }
    })

}

module.exports = { sendVerifyEmail };