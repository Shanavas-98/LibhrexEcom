const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const orderSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    orders: [{
        shipAddress: {
            type: ObjectId,
            ref: 'User.addresses'
        },
        billAddress: {
            type: ObjectId,
            ref: 'User.addresses'
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
        orderStatus: String,
        subtotal: {
            type: Number,
            default: 0
        },
        coupon: {
            name: { type: String },
            code: { type: String },
            discount: { type: Number },
        },
        discount_amount: Number,
        grand_total: Number,
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
        },
        orderDate: {
            type: Date,
            default: Date.now()
        }
    }]

});

module.exports = mongoose.model('Order', orderSchema);