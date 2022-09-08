const { Products } = require("../models");
const { responseFormatter, getFilterObject } = require("../services");

exports.create = async (req, res) => {
    const productObj = new Products(req.body);
    // save category
    productObj.save().then((products) => {
        res.send(responseFormatter(products.toJSON(), 1, "Product created successfully"))
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

exports.update = async (req, res) => {
    try {
        let products = await Products.findById(req.params.id);
        const productParams = { ...req.body };
        // validate
        if (!products) {
            res.send(responseFormatter(null, 0, 'Product not found'));
            return;
        }
        // if (category.categoryName !== categoryParam.categoryName && await Category.findOne({ categoryName: categoryParam.categoryName })) {
        //     res.send(responseFormatter(null, 0, categoryParam.categoryName + ' is already taken'));
        //     return;
        // }
        // copy categoryParam properties to user
        Object.assign(products, productParams);

        products.save().then((updatedProduct) => {
            res.send(responseFormatter(updatedProduct.toJSON(), 1, "Product updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllProducts = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    let filters = {};
    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page > 0 ? ( ( page - 1 ) * limit ) : 0;
        const response = await Products.count(filters);
        const data = {
            products: await Products.find(filters).populate('categoryId').skip(noOfRecordsToSkip).limit(limit),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Products list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.searchProducts = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1,
        searchTerm = req.query.searchTerm.trim() || ''
    let filters = {};
    if(searchTerm == '') {
        res.send(responseFormatter(null, 0, "Search term should not be empty"));
        return;
    }
    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page > 0 ? ( ( page - 1 ) * limit ) : 0;
        const response = await Products.count({ productName: new RegExp('^' + searchTerm, "i"), ...filters });
        const data = {
            products: await Products.find({ productName: new RegExp('^' + searchTerm, "i"), ...filters }).populate('categoryId').skip(noOfRecordsToSkip).limit(limit),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Products list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.getProductById = async (req, res) => {
    try {
        let products = await Products.findById(req.params.id).populate('categoryId')
        if (!products) {
            res.send(responseFormatter(null, 0, 'Product not found'));
            return;
        }
        res.send(responseFormatter(products, 1, "Product data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}
