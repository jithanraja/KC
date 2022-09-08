const { Schema, model } = require("mongoose");

const adminUserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    profileImage: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['superadmin', 'storeadmin', 'productadmin', 'user', 'admin'],
        required: [true, 'role is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already taken'],
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
    mobileNo: {
        type: String,
        required: [true, 'Mobile number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    altMobileNo: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
              return /\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        
    },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})

adminUserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const AdminUser = model('adminuser', adminUserSchema)

module.exports = AdminUser