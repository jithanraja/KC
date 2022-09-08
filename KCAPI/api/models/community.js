const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CommunitySchema = new mongoose.Schema({
    communityName: {
        type: String,
        required: [true, 'Community name is required']
    },
    fbCollectionId:{
        type: String
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    postByAdminOnly: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: ''
    },
    rangeInKm: {
        type: Number,
        required: [true, 'Range is required']
    },
    rangeCoordinates: {
        type: { type: String, default: 'Point' },
        coordinates: []
    },
    members: [{
        memberDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        admin: {
            type: Boolean,
            default: false
        },
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        createdAt: { type: Date, default: Date.now }
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    modifiedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

CommunitySchema.index({ rangeCoordinates: '2dsphere' })
CommunitySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
CommunitySchema.plugin(AutoIncrement, { inc_field: 'communityId', start_seq: 1000 });
const Community = mongoose.model('community', CommunitySchema)

module.exports = Community