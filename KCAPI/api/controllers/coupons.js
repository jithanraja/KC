const { Coupons } = require("../models");
const { responseFormatter, getFilterObject } = require("../services");

exports.create = async (req, res) => {
    if (await Coupons.findOne({ couponCode: req.body.couponCode.toLowerCase() })) {
        res.send(responseFormatter(null, 0, req.body.couponCode + ' is already taken'));
        return;
    }

    const couponObj = new Coupons(req.body);
    console.log(req.currentUser)
    couponObj.createdBy = req.currentUser.firstName + " " + req.currentUser.lastName
    couponObj.save().then((coupons) => {
        res.send(responseFormatter(coupons.toJSON(), 1, "Coupon created successfully"))
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

exports.update = async (req, res) => {
    try {
        let coupons = await Coupons.findById(req.params.id);
        const couponParams = { ...req.body };
        // validate
        if (!coupons) {
            res.send(responseFormatter(null, 0, 'Coupon not found'));
            return;
        }
        if (coupons.couponCode !== couponParams.couponCode && await Coupons.findOne({ couponCode: couponParams.couponCode })) {
            res.send(responseFormatter(null, 0, couponParams.couponCode + ' is already taken'));
            return;
        }
        console.log(req.currentUser)
        couponParams.modifiedBy = req.currentUser.firstName + " " + req.currentUser.lastName;
        Object.assign(coupons, couponParams);

        coupons.save().then((updatedCoupon) => {
            res.send(responseFormatter(updatedCoupon.toJSON(), 1, "Coupon updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllCoupons = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1;
    
    try {
        let filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page <= 1 ? 0 : (limit * page);
        const response = await Coupons.count(filters);
        const data = {
            coupons: await Coupons.find().limit(limit).skip(noOfRecordsToSkip),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Coupons list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.searchCoupons = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1,
        searchTerm = req.query.searchTerm.trim() || ''
    let filters = {};

    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page <= 1 ? 0 : (limit * page);
        const response = await Coupons.count({ couponName: new RegExp('^' + searchTerm, "i"), ...filters });
        const data = {
            coupons: await Coupons.find({ couponName: new RegExp('^' + searchTerm, "i"), ...filters }).limit(limit).skip(noOfRecordsToSkip),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Coupons search result"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.getCouponById = async (req, res) => {
    try {
        let coupon = await Coupons.findById(req.params.id)
        if (!coupon) {
            res.send(responseFormatter(null, 0, 'Coupon not found'));
            return;
        }
        res.send(responseFormatter(coupon, 1, "Coupon data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}