const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ProductsSchema = new mongoose.Schema({
    productId: {
        type: Number,
        unique: true
    },
    productName: {
        type: String,
        required: [true, 'Product name is required']
    },
    productImage: {
        type: String
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Select category'],
        ref: 'categories'
    }, 
    buyingPrice: {
        type: Number,
        required: [true, 'Buying price is required']
    }, 
    displayPrice: {
        type: Number,
        required: [true, 'Display name is required']
    }, 
    maxDiscount: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
              return v <= 100;
            },
            message: props => `Maximum discount must be less than or equals 100%`
        }
    }, 
    unitType: {
        type: String,
        required: [true, 'Select unit type'],
        enum: ['kg', 'pcs', 'ltrs']
    },
    slabs: [{
        from: {
            type: Number,
        },
        to: {
            type: Number,
        },
        unitPrice: {
            type: Number,
        },
    }],
    status: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})

ProductsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

ProductsSchema.plugin(AutoIncrement, { inc_field: 'productId', start_seq: 2000 });
const Products = mongoose.model('products', ProductsSchema)
module.exports = Products