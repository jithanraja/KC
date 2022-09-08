const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StoreSchema = new mongoose.Schema({
    storeId: {
        type: Number,
        unique: true
    },
    storeName: {
        type: String,
        required: [true, 'Store name is required']
    },
    representative: {
        type: String,
        required: [true, 'Representative name is required']
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    emailId: {
        type: String,
        required: [true, 'Email id is required'],
        validate: {
            validator: function(v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not an email`
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function(v) {
              return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(v);
            },
            message: props => 'Password must contain atleast one uppercase, lowercase, special character(#?!@$%^&*-) and number'
        },
        select: false
    },
    altContactNo: {
        type: String,
        required: [true, 'Alternative contact number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    address: {
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
        }
    },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})


StoreSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

StoreSchema.plugin(AutoIncrement, { inc_field: 'storeId', start_seq: 3000 });
const Stores = mongoose.model('stores', StoreSchema)

module.exports = Stores