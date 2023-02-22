const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true
    },
    validity:{
        type:Date,
        required: true
    }
})

module.exports = mongoose.model('Otp',otpSchema);