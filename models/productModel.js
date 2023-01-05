const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({
    brand: {
        type: Objectid,
        required: true,
        ref: "BrandData"
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
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
    },

})

module.exports = mongoose.model('Product', productSchema);