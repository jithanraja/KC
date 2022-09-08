const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    doorNo: {
        type: String,
        required: [true, 'Door number is required']
    },
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    locality: {
        type: String,
        required: [true, 'Locality is required']
    },
    area: {
        type: String,
        required: [true, 'Area is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    district: {
        type: String,
        required: [true, 'District is required']
    },
    pincode: {
        type: Number,
        required: [true, 'Pincode is required'],
        validate: {
            validator: function(v) {
                return /^(\d{4}|\d{6})$/.test(v);
            },
            message: props => `${props.value} is not a valid pincode!`
        },
    },
    location: {
        coordinates: {
            type: [Number],
            required: [true, 'Location coordinates is required']
        }
    },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})


AddressSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Address = mongoose.model('address', AddressSchema)

module.exports = Address