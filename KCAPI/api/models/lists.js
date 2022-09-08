const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    userId: {
        type: String
    }
})

ListSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const Favorites = mongoose.model('favorites', ListSchema)
module.exports = Favorites