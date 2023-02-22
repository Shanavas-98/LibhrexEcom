const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true
    },
    company : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    address:{
        type:String,
        required: true
    }
});

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
    addresses:[addressSchema],
    verified: {
        type: Boolean,
        default: false
    },
    blocked : {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date("<YYYY-mm-dd>")
    }
})

module.exports = mongoose.model('User',userSchema);