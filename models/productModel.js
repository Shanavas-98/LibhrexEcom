const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({

    category:{
        type: ObjectId,
        required: true,
        ref:"Categories"
    },
    subcategory:{
        type: ObjectId,
        required: true,
        ref:"Subcategories"
    },
    product: {
        type: String,
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
    image: {
        type: [String],
        required: true
    },
    blocked: {
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