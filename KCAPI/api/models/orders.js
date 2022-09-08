const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrdersSchema = new mongoose.Schema({
    OrderId: {
        type: Number,
        unique: true
    },
    orderStatus: {
        type: String,
        default: 'ordered',
        enum: ["ordered", "assigned", "completed", "declined"],
        required: true
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    },
    transactionProperties: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions'
    },
    properties: {
        totalAmt: {
            type: Number,
            required: [true, 'Total amount is missing']
        },
        amount: {
            type: Number,
            required: [true, 'Amount is missing']
        },
        taxInfo: {
            GST: Number,
            VAT: Number
        },
        couponCode: {
            type: String,
        },
        amtFromWallet: Number,
        items: [
            {
                name: {
                    type: String,
                    required: [true, 'Items name is missing']
                },
                qty: {
                    type: Number,
                    required: [true, 'Items quantity is missing']
                },
                unit: {
                    type: String,
                    required: [true, 'Unit type is missing'],
                    enum: ['kg', 'pcs', 'ltrs']
                },
                price: {
                    type: Number,
                    required: [true, 'Items price is missing']
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                }
            }
        ]
    },
    deliveryDetails: {
        storeAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'address'
        },
        deliveryAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'address'
        }
    },
    createdDate: { type: Date, default: Date.now }
});

OrdersSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

OrdersSchema.plugin(AutoIncrement, { inc_field: 'OrderId', start_seq: 5000 });
const Orders = mongoose.model('orders', OrdersSchema)
module.exports = Orders
