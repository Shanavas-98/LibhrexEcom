const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    mobile : {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    password2 : {
        type: String,
        required: true
    },
    blocked : {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('User',userSchema);