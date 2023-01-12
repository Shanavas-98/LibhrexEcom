
const sendOtp = require("../utils/nodemailer");

module.exports = {
    getOtp: async (req, res, next) => {
        let email = req.body.email;
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        await sendOtp.sendVerifyEmail(email, otp)
            .then(()=>{
                next()
            }).catch((error)=>{
                next(error)
            })
        
    }
}