const { Orders } = require("../models");
const { OrderWallets } = require("../models");
const { responseFormatter, getFilterObject } = require("../services");
var mongoose = require('mongoose');

exports.create = async (req, res) => {
    const orderObj = new Orders(req.body);
    // save category
    orderObj.save().then((orders) => {
        orders.properties.items.forEach(async (obj, index) => {
            const refKeys = {
                userId: mongoose.Types.ObjectId(req.currentUser._id),
                productId: mongoose.Types.ObjectId(obj.productId),
                communityId: mongoose.Types.ObjectId(orders.communityId),
            };
            var curDate = new Date();
            var last24Hour = new Date(curDate.getTime() - 1000 * 60 * 1440);
            const condCheck = {
                ...refKeys,
                createdDate: {
                    $gt: last24Hour
                }
            };
            const stages = await OrderWallets.find({}).sort({ stages: -1 }).limit(1).then(stages => stages.length > 0 ? stages[0].stages + 1 : 1);
            const userCheck = await OrderWallets.findOne(condCheck);
            const updateCond = {
                productId: mongoose.Types.ObjectId(obj.productId),
                communityId: mongoose.Types.ObjectId(orders.communityId),
                createdDate: {
                    $gt: last24Hour
                }
            };
            if (!userCheck) {
                const orderWalletObj = new OrderWallets({
                    orderId: orders.id,
                    stages: stages ? stages : 1,
                    walletAmount: 0,
                    ...refKeys
                });
                await updateWalletAmount(null, req.currentUser._id, updateCond, 10);
                orderWalletObj.save().then((orderwallet) => {
                    if (orders.properties.items.length == index + 1)
                        res.send(responseFormatter(orders.toJSON(), 1, "Order created successfully"))
                });
            } else {
                await updateWalletAmount(userCheck.userId, req.currentUser._id, updateCond, 10);
                if (orders.properties.items.length == index + 1)
                    res.send(responseFormatter(orders.toJSON(), 1, "Order created successfully"))

            }

        });
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

const updateWalletAmount = async (userId, currentUser_id, updateCond, walletAmount) => {
    if (userId !== currentUser_id) {
        return await OrderWallets.findOneAndUpdate(updateCond, { $set: { walletAmount: + walletAmount }, sort: { stages: 1 } });
    }
}

exports.update = async (req, res) => {
    try {
        let orders = await Orders.findById(req.params.id);
        const orderParams = { ...req.body };
        // validate
        if (!orders) {
            res.send(responseFormatter(null, 0, 'Order not found'));
            return;
        }
        // if (category.categoryName !== categoryParam.categoryName && await Category.findOne({ categoryName: categoryParam.categoryName })) {
        //     res.send(responseFormatter(null, 0, categoryParam.categoryName + ' is already taken'));
        //     return;
        // }
        // copy categoryParam properties to user
        Object.assign(orders, orderParams);

        orders.save().then((updatedOrder) => {
            res.send(responseFormatter(updatedOrder.toJSON(), 1, "Order updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllOrders = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    let filters = {};
    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page > 0 ? ((page - 1) * limit) : 0;
        const response = await Orders.count(filters);
        const data = {
            orders: await Orders.find(filters).skip(noOfRecordsToSkip).limit(limit),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Orders list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.searchOrders = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1,
        searchTerm = req.query.searchTerm.trim() || ''
    let filters = {};
    if (searchTerm == '') {
        res.send(responseFormatter(null, 0, "Search term should not be empty"));
        return;
    }
    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page > 0 ? ((page - 1) * limit) : 0;
        const response = await Orders.count({ orderName: new RegExp('^' + searchTerm, "i"), ...filters });
        const data = {
            orders: await Orders.find({ orderName: new RegExp('^' + searchTerm, "i"), ...filters }).populate('categoryId').skip(noOfRecordsToSkip).limit(limit),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Orders list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.getOrderById = async (req, res) => {
    try {
        let orders = await Orders.findById(req.params.id)
        if (!orders) {
            res.send(responseFormatter(null, 0, 'Order not found'));
            return;
        }
        res.send(responseFormatter(orders, 1, "Order data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}
