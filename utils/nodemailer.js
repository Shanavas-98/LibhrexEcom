const nodemailer = require('nodemailer');
const email = process.env.USER_EMAIL;
const password = process.env.USER_PASS;

async function sendVerifyEmail(userEmail,otp){

const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: "web3dev23@gmail.com",
        pass: "igzucynjncvxwekj"
    }
})

const message = {
    from: '"Libhrex Ecom" <noreply@libhrex.com>',
    to: userEmail,
    subject: "Email Verification OTP",
    text: `Your OTP code is ${otp}. Please enter this code to verify your email address.`,
    html: `<p>Your OTP code is <strong>${otp}</strong>. Please enter this code to verify your email address.</p>`
}

const info = await mailTransporter.sendMail(message, (err)=>{
    if(err){
        console.log("Sending email failed",err);
    }else{
        console.log("Email sent successfully",info.messageId);
    }
})

}

module.exports = {sendVerifyEmail};