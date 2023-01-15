const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const wishlistSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    wishItems: [{
        product: {
            type: ObjectId,
            ref: 'Product'
        }
    }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);