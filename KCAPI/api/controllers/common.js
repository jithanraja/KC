const jwt = require("jsonwebtoken");
const { responseFormatter, SendMail } = require("../services");
const { OAuth2Client } = require('google-auth-library')
const config = require("../../config");
const Community = require("../models/community");
const Category = require("../models/category");
const Products = require("../models/products");
const client = new OAuth2Client(config.Google_ClientId)

exports.getResponse = async (req, res) => { 
    res.send(responseFormatter(null, 1, "Sample Response"))
}

exports.generateToken = async (req, res) => {
    const token = jwt.sign({ id: '1234567890', username: 'test' }, req.app.get("secretKey"), { expiresIn: '365d' });
    res.json({ token })
}

exports.sendMail = async (req, res) => {
    const mailResponse = await SendMail(req.body.mailTo, req.body.subject, (req.body.type == 'text' ? req.body.content : req.body.macros), req.body.type != 'text' ? req.body.content : 'text', req.body.mailFrom)
    res.json(responseFormatter(mailResponse, 1, null))
}

exports.devTestAPI = async (req, res) => {
    res.json(responseFormatter(null, 1, "Don't commit your changes on this API. This is only for dev purpose"))
}

exports.dashboardSearch = async (req, res) => {
    const searchTerm = req.body.searchTerm.trim() || '';

    if(searchTerm == '') {
        res.send(responseFormatter(null, 0, "Search term should not be empty"));
        return;
    }
    try {
        const data = {
            community: await Community.find({ communityName: new RegExp('^' + searchTerm, "i") }).limit(5),
            category: await Category.find({ categoryName: new RegExp('^' + searchTerm, "i") }).limit(5),
            product: await Products.find({ productName: new RegExp('^' + searchTerm, "i") }).limit(5),
        }
        res.send(responseFormatter(data, 1, "Products list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}