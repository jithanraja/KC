const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment is required']
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: { type: Date, default: Date.now }
})

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]
})

const Comments = mongoose.model('comments', CommentsSchema)
const Posts = mongoose.model('posts', PostsSchema)

module.exports = {
    Comments,
    Posts
}