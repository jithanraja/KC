const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { responseFormatter } = require("../services");

exports.delete = async (req, res) => {
    console.log(req.params.id);
    mongoose.connection.db.dropCollection(req.params.id).then((data) => {
        res.send(responseFormatter(data, 1, "Collection deleted successfully"))
    }).catch(err => {
        res.send(responseFormatter(err, 0, err.name))
    })
}

exports.getAllCollection = async (req, res) => {
    const collections = await mongoose.connection.db.listCollections()
    await collections
        .toArray(function(err, names) {   
            if(!err) {
                console.log(names)
            }
        });
    // .then((data) => {
        res.send(responseFormatter(null, 1, "Collections list - check console"))
    // }).catch(err => {
    //     res.send(responseFormatter(err.errors, 0, err.name))
    // })
}
