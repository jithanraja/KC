const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const TransactionSchema = new mongoose.Schema({
    TransactionId: {
        type: Number,
        unique: true
    },
    TransactionType: {
        type: String,
        enum: ['credit-to-wallet', 'debit-from-wallet', 'by-order'],
        required: [true, 'Transaction type is required']
    }
    // Other properties will goes here
});

TransactionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
TransactionSchema.plugin(AutoIncrement, { inc_field: 'TransactionId', start_seq: 6000 });
const Transaction = mongoose.model('transactions', TransactionSchema)

module.exports = Transaction