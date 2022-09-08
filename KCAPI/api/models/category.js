const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    categoryId: {
        type: Number,
        unique: true
    },
    categoryName: {
        type: String,
        required: [true, 'category name is required']
    },
    categoryImage: {
        type: String,
        default: ''
    },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
})


CategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
CategorySchema.plugin(AutoIncrement, { inc_field: 'categoryId', start_seq: 1000 });
const Category = mongoose.model('categories', CategorySchema)

module.exports = Category