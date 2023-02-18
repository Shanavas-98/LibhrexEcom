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
    max: 100
  },
  minBill: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    required: true,
    min: 0
  },
  validity: {
    type: Date,
    required: true
  },
  availableUsers: {
    type: [ObjectId],
    ref: 'User'
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);
