const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderWalletsSchema = new mongoose.Schema({
    OrderWalletId: {
        type: Number,
        unique: true
    },
    stages: {
        type: Number
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions'
    },
    walletAmount: {
        type: Number
    },
    createdDate: { type: Date, default: Date.now }
});

OrderWalletsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

OrderWalletsSchema.plugin(AutoIncrement, { inc_field: 'OrderWalletId', start_seq: 5000 });
const OrderWalletWallets = mongoose.model('orderwallets', OrderWalletsSchema)
module.exports = OrderWalletWallets
