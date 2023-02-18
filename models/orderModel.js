const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    shipAddress: {
        type: Object,
        required: true
    },
    billAddress: {
        type: Object,
        required: true
    },
    payment: {
        id: String,
        method: { type: String, required: true },
        status: { type: String, default: "pending" }
    },
    orderItems: [{
        product: {
            type: ObjectId,
            ref: 'Product'
        },
        price: {
            type: Number,
            default: 0
        },
        qty: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        }
    }],
    subtotal: {
        type: Number,
        min:0,
        default: 0
    },
    coupon:Object,
    discount: Number,
    grandtotal: Number,
    orderStatus: String,
    orderDate: {
        type: Date,
        default: Date.now()
    },
    deliveryStatus: {
        ordered: {
            state: { type: Boolean, default: false },
            date: Date
        },
        shipped: {
            state: { type: Boolean, default: false },
            date: Date
        },
        out_for_delivery: {
            state: { type: Boolean, default: false },
            date: Date
        },
        delivered: {
            state: { type: Boolean, default: false },
            date: Date
        },
        cancelled: {
            state: { type: Boolean, default: false },
            date: Date
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);