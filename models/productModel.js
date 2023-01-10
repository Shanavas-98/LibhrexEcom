const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({

    cat_id:{
        type: ObjectId,
        required: true,
        ref:"Categories"
    },
    subcat_id:{
        type: ObjectId,
        required: true,
        ref:"Subcategories"
    },
    productName: {
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