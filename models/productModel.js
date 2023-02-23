const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({

    catId:{
        type: ObjectId,
        ref:"Categories"
    },
    subcatId:{
        type: ObjectId,
        ref:"Subcategories"
    },
    productName: {
        type: String,
        unique:true,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    srp: {
        type: Number,
        required: true
    },
    discount:{
        type:Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    flag: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    blockedDate: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);