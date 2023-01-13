const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    cartItems: [{
        productId: {
            type: ObjectId,
            ref: 'product'
        },

        quantity: {
            type: Number,
            default: 1
        }
    }]
});

module.exports = mongoose.model('cart', cartSchema);