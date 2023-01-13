const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerName:{
        type: String,
        required: true
    },
    bannerHead:{
        type: String,
        required: true
    },
    bannerImage:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Banner',bannerSchema);