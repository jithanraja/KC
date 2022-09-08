const { default: mongoose } = require("mongoose");
const { Favorites } = require("../models");
const { responseFormatter } = require("../services");

exports.addItemToFavList = async (req, res) => {
    const listObj = await Favorites.findOne({ userId: req._id })
    // console.log(listObj)
    if (listObj) {
        Favorites.updateOne(
            { userId: req._id },
            { $push: { product: [ req.body.productId ] } },
            function(err, result) {
              if (err) {
                res.send(responseFormatter(err.errors, 0, err.name))
              } else {
                res.send(responseFormatter(result, 1, "Item added to the list"))
              }
            }
        );
    } else {
        let favObj = new Favorites({
            userId: req._id,
            product: [ req.body.productId ]
        })
        favObj.save().then((list) => {
            res.send(responseFormatter(list, 1, "Item added to the list"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        });
    }
}

exports.getFavList = async (req, res) => {
    const listObj = await Favorites.findOne({ userId: req._id })
    if (listObj) {
        res.send(responseFormatter(listObj, 1, "List Items"))
    } else {
        res.send(responseFormatter(null, 1, "List not found for this user"))
    }
}

exports.getFavListDetails = async (req, res) => {
    const listObj = await Favorites.findOne({ userId: req._id }).populate('product')
    if (listObj) {
        res.send(responseFormatter(listObj, 1, "List Items"))
    } else {
        res.send(responseFormatter(null, 1, "List not found for this user"))
    }
}

exports.removeItemFromFavList = async (req, res) => {
    const listObj = await Favorites.findOne({ userId: req._id })
    if (listObj) {
        let inx = listObj.product.indexOf(mongoose.Types.ObjectId(req.body.productId), 0);
        console.log(listObj.product, inx)
        if(inx > -1) {
            listObj.product.splice(inx, 1);
            listObj.save().then((list) => {
                res.send(responseFormatter(list, 1, "Item removed from the list"))
            }).catch(err => {
                res.send(responseFormatter(err.errors, 0, err.name))
            });
        } else {
            res.send(responseFormatter(null, 0, 'Item not found in the list'))
        }
    } else {
        res.send(responseFormatter(null, 0, 'List not found'))
    }
}