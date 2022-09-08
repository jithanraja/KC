const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CouponsSchema = new mongoose.Schema({
    couponId: {
        type: Number,
        unique: true
    },
    couponName: {
        type: String,
        required: [true, 'Coupon name is required']
    },
    couponCode: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: [true, 'Coupon code must be unique']
    }, 
    couponDescription: {
        type: String,
        required: [true, 'Description is required']
    }, 
    imageURL: {
        type: String,
    },
    percentage: {
        type: Number,
        required:  [true, 'coupon percentage is required'],
        validate: {
            validator: function(v) {
                return v > 0 && v <= 100;
            },
            message: props => `Maximum discount must be less than or equals 100%`
        }
    },
    status: { type: Boolean, default: true },
    createdBy: String,
    modifiedBy: String,
    createdDate: { type: Date, default: Date.now },
})

CouponsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
}); 

CouponsSchema.plugin(AutoIncrement, { inc_field: 'couponId', start_seq: 4000 });
const Coupons = mongoose.model('coupons', CouponsSchema)
module.exports = Coupons