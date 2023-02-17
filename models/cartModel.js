const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    cartItems: [{
        product: {
            type: ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            default: 1
        },

        price:{
            type: Number,
            default:0
        }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);