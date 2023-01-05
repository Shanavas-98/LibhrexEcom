const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    branch:{
        type:String,
        required:true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    phone :Number,
    password : {
        type: String,
        required: true
    },
    type : {
        type: String,
        default: 'admin'
    }

})

module.exports= mongoose.model('Admin',adminSchema);