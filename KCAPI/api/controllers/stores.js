const { Stores } = require("../models");
const { responseFormatter } = require("../services");

exports.create = async (req, res) => {
    // if (await Stores.findOne({ storeName: req.body.storeName })) {
    //     res.send(responseFormatter(null, 0, req.body.storeName + ' is already taken'));
    //     return;
    // }

    console.log(req.body)
    const storeObj = new Stores(req.body);

    // save store
    storeObj.save().then((store) => {
        res.send(responseFormatter(store.toJSON(), 1, "Store created successfully"))
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

exports.update = async (req, res) => {
    try {
        let store = await Stores.findById(req.params.id);
        const storeParam = { ...req.body };
        // validate
        if (!store) {
            res.send(responseFormatter(null, 0, 'store not found'));
            return;
        }

        // copy storeParam properties to store
        Object.assign(store, storeParam);

        store.save().then((updatedStore) => {
            res.send(responseFormatter(updatedStore.toJSON(), 1, "Store updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllStores = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    const noOfRecordsToSkip = page <= 1 ? 0 : (limit * page);
    const response = await Stores.find();
    const data = {
        stores: await Stores.find().limit(limit).skip(noOfRecordsToSkip),
        pageInfo: {
            page,
            size: limit,
            totalCount: response.length
        }
    }
    res.send(responseFormatter(data, 1, "Stores list"))
}

exports.getStoreById = async (req, res) => {
    try {
        res.send(responseFormatter(await Stores.findById(req.params.id).populate('password'), 1, "Store data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}
