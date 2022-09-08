const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema({
    friends: [{
        info: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        requested: mongoose.Schema.Types.Boolean,
        blocked: mongoose.Schema.Types.Boolean
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: { type: Date, default: Date.now },
})

FriendsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
}); 

const Friends = mongoose.model('friends', FriendsSchema)
module.exports = Friends