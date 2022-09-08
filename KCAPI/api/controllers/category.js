const jwt = require("jsonwebtoken");
const { Category } = require("../models");
const { responseFormatter, encrypt, decrypt } = require("../services");

exports.create = async (req, res) => {
    if (await Category.findOne({ categoryName: req.body.categoryName.toLowerCase() })) {
        res.send(responseFormatter(null, 0, req.body.categoryName + ' is already taken'));
        return;
    }

    const categoryObj = new Category(req.body);

    Object.assign(categoryObj, { categoryName: req.body.categoryName.toLowerCase() })

    // save category
    categoryObj.save().then((category) => {
        res.send(responseFormatter(category.toJSON(), 1, "Category created successfully"))
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

exports.update = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        const categoryParam = { ...req.body };
        categoryParam.categoryName = categoryParam.categoryName.toLowerCase();
        // validate
        if (!category) {
            res.send(responseFormatter(null, 0, 'Category not found'));
            return;
        }
        if (category.categoryName !== categoryParam.categoryName && await Category.findOne({ categoryName: categoryParam.categoryName })) {
            res.send(responseFormatter(null, 0, categoryParam.categoryName + ' is already taken'));
            return;
        }

        // copy categoryParam properties to user
        Object.assign(category, categoryParam);

        category.save().then((updatedCategory) => {
            res.send(responseFormatter(updatedCategory.toJSON(), 1, "Category updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllCategories = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    const noOfRecordsToSkip = page <= 1 ? 0 : (limit * page);
    const response = await Category.find();
    const data = {
        categories: await Category.find().limit(limit).skip(noOfRecordsToSkip),
        pageInfo: {
            page,
            size: limit,
            totalCount: response.length
        }
    }
    res.send(responseFormatter(data, 1, "Category list"))
}

exports.getCategoryById = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id)
        if (!category) {
            res.send(responseFormatter(null, 0, 'Category not found'));
            return;
        }
        res.send(responseFormatter(category, 1, "Category data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}
