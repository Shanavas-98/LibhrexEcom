const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  minimumBill: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    required: true,
    min: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  availableUsers: {
    type: [ObjectId],
    ref: 'User'
  }
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;