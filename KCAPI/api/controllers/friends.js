const mongoose = require("mongoose");
const { Friends } = require("../models");
const { responseFormatter } = require("../services");

exports.addFriend = async (req, res) => {
    const friendId = req.body.fId;
    if(await Friends.findOne({ userId: req._id, 'friends.info': friendId })) {
        res.send(responseFormatter(null, 0, 'Already a friend'))
        return;
    }
    if (await Friends.findOne({ userId: req._id })) {
        Friends.findOneAndUpdate({ userId: req._id, 'friends.info': friendId }, {
            $set: {
                "friends.$.requested": false,
                "friends.$.blocked": false
            }
        },
        { new: true },
        function(err, result) {
                console.log(err)
            if (err) {
                res.send(responseFormatter(err.errors, 0, err.name))
            } else {
                res.send(responseFormatter(result, 1, "User added to the Friend list"))
            }
        })
    } else {
        const friends = new Friends({
            friends: [{
                info: friendId,
                requested: false,
                blocked: false
            }],
            userId: req._id
        })

        friends.save().then((data) => {
            res.send(responseFormatter(data.toJSON(), 1, "User added to the Friend list"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    }
}

exports.requestFriend = async (req, res) => {
    const userId = req.body.uid;
    addFriendIfExist(userId, req._id)
        .then((data) => {
            console.log(data)
            addFriendIfExist(req._id, userId, true)
                .then((ddata) => {
                    console.log('dd => ', ddata)
                    res.send(responseFormatter(ddata, 1, "User added to the Friend list"))
                }).catch(err => {
                    console.log('dde => ', err)
                    res.send(responseFormatter(err.errors, 0, err.name))
                })
        }).catch(err => {
            console.log(err)
            res.send(responseFormatter(err.errors, 0, err.name))
        })
}

exports.blockOrUnblock = async (req, res) => {
    const friendId = req.body.fId;
    if(await Friends.findOne({ userId: req._id, 'friends.info': friendId, 'friends.blocked': true })) {
        Friends.findOneAndUpdate({ userId: req._id, 'friends.info': friendId, 'friends.blocked': true }, {
            $set: {
                "friends.$.blocked": false
            }
        },
        { new: true },
        async function(err, result) {
            console.log(err)
            if (err) {
                res.send(responseFormatter(err.errors, 0, err.name))
            } else {
                let chatId = '';
                if (friendId < req._id) {
                    chatId = friendId + '' + req._id
                } else {
                    chatId = req._id + '' + friendId
                }
                const chatDoc = global.fireDb.collection('conversations').doc(chatId);
                const isExist = (await chatDoc.get()).exists
                console.log(isExist)
                if(isExist) {
                    await chatDoc.update({
                        blockedBy: global.fireAdmin.firestore.FieldValue.arrayRemove(req._id)
                    })
                }
                res.send(responseFormatter(result, 1, "Unblocked"))
            }
        })
    } else {
        Friends.findOneAndUpdate({ userId: req._id, 'friends.info': friendId }, {
            $set: {
                "friends.$.blocked": true
            }
        },
        { new: true },
        async function(err, result) {
                console.log(err)
            if (err) {
                res.send(responseFormatter(err.errors, 0, err.name))
            } else {
                let chatId = '';
                if (friendId < req._id) {
                    chatId = friendId + '' + req._id
                } else {
                    chatId = req._id + '' + friendId
                }
                const chatDoc = global.fireDb.collection('conversations').doc(chatId);
                const isExist = (await chatDoc.get()).exists
                console.log(isExist)
                if(isExist) {
                    await chatDoc.update({
                        blockedBy: global.fireAdmin.firestore.FieldValue.arrayUnion(req._id)
                    })
                }
                res.send(responseFormatter(result, 1, "Blocked"))
            }
        })
    }
}

exports.getFriends = async (req, res) => {
    res.send(responseFormatter(await Friends.findOne({ userId: req._id }).populate('friends.info', ['displayName', 'photoURL', 'id']).populate('userId', ['displayName', 'photoURL', 'id']), 1, "Friends List"))
}

async function addFriendIfExist(userId, friendId, byMe = false) {
    if (await Friends.findOne({ userId: userId })) {
        if(await Friends.findOne({ userId: userId, 'friends.info': friendId, 'friends.requested': byMe })) {
            return new Promise((resolve, reject) => { throw {name: 'You have already requested'} });
        }
        return Friends.findOneAndUpdate({ userId: userId, 'friends.info': friendId }, {
            $set: {
                "friends.$.requested": byMe
            } 
        })
    } else {
        const friends = new Friends({
            friends: [{
                info: friendId,
                requested: !byMe,
                blocked: false
            }],
            userId: userId
        })

        return friends.save()
    }
}