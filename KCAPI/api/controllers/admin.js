const jwt = require("jsonwebtoken");
const { AdminUser } = require("../models");
const { responseFormatter } = require("../services");

exports.login = async (req, res) => {
    const user = await AdminUser.findOne({
        username: req.body.username,
        password: req.body.password,
        isActive: true
    })

    if (user) {
        const token = jwt.sign({ ...user.toJSON() }, req.app.get("secretKey"), { expiresIn: '365d' });
        res.send(responseFormatter({
            ...user.toJSON(),
            token
        }, 1, 'User signed in successfully'))
    } else {
        res.send(responseFormatter(null, 0, "Invalid credentials"))
    }
}

exports.register = async (req, res) => {
    if (await AdminUser.findOne({ username: req.body.username })) {
        res.send(responseFormatter(null, 0, req.body.username + ' is already taken'));
        return;
    }

    const userObj = new AdminUser(req.body);

    // save user
    userObj.save().then((user) => {
        res.send(responseFormatter(user.toJSON(), 1, "User created successfully"))
    }).catch(err => {
        res.send(responseFormatter(err.errors, 0, err.name))
    })
}

exports.update = async (req, res) => {
    try {
        let user = await AdminUser.findById(req.params.id);
        const userParam = { ...req.body };
        // validate
        if (!user) {
            res.send(responseFormatter(null, 0, 'User not found'));
            return;
        }
        if (user.username !== userParam.username && await AdminUser.findOne({ username: userParam.username })) {
            res.send(responseFormatter(null, 0, userParam.username + ' is already taken'));
            return;
        }

        // copy userParam properties to user
        Object.assign(user, userParam);

        user.save().then((updatedUser) => {
            res.send(responseFormatter(updatedUser.toJSON(), 1, "User updated successfully"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getAllUsers = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    const noOfRecordsToSkip = page <= 1 ? 0 : (limit * page);
    const response = await AdminUser.find();
    const data = {
        users: await AdminUser.find().limit(limit).skip(noOfRecordsToSkip),
        pageInfo: {
            page,
            size: limit,
            totalCount: response.length
        }
    }
    res.send(responseFormatter(data, 1, "User list"))
}

exports.getUserById = async (req, res) => {
    try {
        res.send(responseFormatter(await AdminUser.findById(req.params.id).populate('password'), 1, "User data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        res.send(responseFormatter(await AdminUser.findById(req.currentUser.id), 1, "User data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}