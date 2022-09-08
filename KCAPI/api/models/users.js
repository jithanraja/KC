const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, 'name is required']
    },
    photoURL: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email already taken'],
        validate: {
            validator: function(v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not an email`
        },
    },
    password: {
        type: String,
        required: [function() { return !this.isGoogleUser }, 'Password is required'],
        validate: {
            validator: function(v) {
              return !this.isGoogleUser && /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(v);
            },
            message: props => 'Password must contain atleast one uppercase, lowercase, special character(#?!@$%^&*-) and number'
        },
        select: false
    },
    phoneNumber: {
        type: String,
        required: [function() { return !this.isGoogleUser }, 'Phone number is required'],
        unique: [true, 'Phone Number already taken'],
        sparse: true,
        validate: {
            validator: function(v) {
                return !this.isGoogleUser && /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    isGoogleUser: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Users = model('users', userSchema)

module.exports = Users