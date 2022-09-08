const Community = require("../models/community");
const Users = require("../models/users");
const { responseFormatter, get, getFilterObject } = require("../services")
var mongoose = require('mongoose');
const { Posts, Comments } = require("../models/communityUtils");


exports.create = async (req, res) => {

    global.fireDb.collection("communities").add({
        ...(req.body || {}),
        createdBy: req._id,
        members: [{
            memberDetails: req._id,
            admin: true,
            createdDate: Date.now()    
        }],
        directRequests:[],
        createdDate: Date.now()
    })
        .then((community) => {
            const communityObj = new Community({
                ...req.body,
                fbCollectionId: community.id,
                createdBy: req._id,
                posts: [],
                members: [{
                    memberDetails: req._id,
                    admin: true 
                }]
            });
            communityObj.save().then((communityM) => {
                res.send(responseFormatter(communityM.toJSON(), 1, "Community created successfully"))
            }).catch(err => {
                global.fireDb.collection("communities").doc(community.id).delete()
                    .then(() => {
                        console.log('Community deleted successfully');
                    })
                    .catch((error) => {
                        console.log('Error deleting community: ', error);
                    });
                res.send(responseFormatter(err.errors, 0, err.name))
            })
            // res.send(responseFormatter(userRecord.toJSON(), 1, "User created successfully"))
        })
        .catch((error) => {
            res.send(responseFormatter(null, 0, error.message))
        });
}

exports.joinOrRequestToCommunity = async (req, res) => {
    const communityId = req.body.communityId || '',
        acceptedBy = req._id,
        invitedBy = req.body.invitedBy || '',
        joinType = req.body.joinType,
        memberId = req.body.memberId || '';

    if(communityId.trim() != '') {
        if(joinType == 'request') {
            try {
                Community.findOneAndUpdate(
                    { _id: communityId },
                    { $push: { members: [{
                        memberDetails: memberId,
                        ...invitedBy.trim() != '' ? { invitedBy: invitedBy } : {},
                        acceptedBy: acceptedBy,
                    }] } },
                    function(err, result) {
                        console.log(err)
                    if (err) {
                        res.send(responseFormatter(err.errors, 0, err.name))
                    } else {
                        global.fireDb.collection("communities").doc(result.fbCollectionId).update({
                            members: global.fireAdmin.firestore.FieldValue.arrayUnion({
                                memberDetails: memberId.trim(),
                                ...invitedBy.trim() != '' ? { invitedBy: invitedBy } : {},
                                acceptedBy: acceptedBy,
                                admin: false,
                                createdDate: Date.now()
                            })
                        }).then((data) => {
                            res.send(responseFormatter(data, 1, "User added to the community"))
                        })
                        .catch((error) => {
                            res.send(responseFormatter(error, 0, "Unable to update in the firebase" + result.fbCollectionId))
                        });
                    }
                    }
                );
            } catch(err) {
                console.log(err)
                res.send(responseFormatter(err, 0, ''))
            }
        } else {
            Community.findOneAndUpdate(
                { _id: communityId },
                { $push: { members: [{
                    memberDetails: req._id,
                    ...invitedBy.trim() != '' ? { invitedBy: invitedBy } : {} 
                }] } },
                function(err, result) {
                  if (err) {
                    res.send(responseFormatter(err.errors, 0, err.name))
                  } else {
                      console.log(result)
                    global.fireDb.collection("communities").doc(result.fbCollectionId).update({
                        members: global.fireAdmin.firestore.FieldValue.arrayUnion({
                            memberDetails: req._id,
                            ...invitedBy.trim() != '' ? { invitedBy: invitedBy } : {},
                            admin: false,
                            createdDate: Date.now()
                        })
                    }).then((data) => {
                        res.send(responseFormatter(data, 1, "User added to the community"))
                    })
                    .catch((error) => {
                        res.send(responseFormatter(error, 0, "Unable to update in the firebase" + result.fbCollectionId))
                    });
                  }
                }
            );
        }
    } else {
        res.send(responseFormatter(null, 0, "Please provide the community id."))
    }
}

exports.getCommunityMembers = async (req, res) => {
    const memberIds = req.body.memberIds || '';
    if(memberIds.trim() != '') {
        console.log(memberIds.trim().split(','))
        let users = await Users.find({
            '_id': { '$in': memberIds.trim().split(',').map(item => item != '' && mongoose.Types.ObjectId(item)) }
        }).select('_id displayName photoURL')
        if(users) {
            res.send(responseFormatter(users, 1, "Members List"))
        } else {
            res.send(responseFormatter(null, 0, "No members found"))    
        }
    } else {
        res.send(responseFormatter(null, 0, "Empty members list"))
    }
}


exports.getMyCommunity = async (req, res) => {
    var id = mongoose.Types.ObjectId(req._id);
    try {
        let community = await Community.find({ "members.memberDetails": { $in: [id] } })
        if (!community) {
            res.send(responseFormatter(null, 0, 'Community not found'));
            return;
        }
        res.send(responseFormatter({ products: community }, 1, "Community data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getCommunityByUserId = async (req, res) => {
    var id = mongoose.Types.ObjectId(req.query.userId);
    try {
        let community = await Community.find({ "members.memberDetails": { $in: [id] } })
        if (!community) {
            res.send(responseFormatter(null, 0, 'Community not found'));
            return;
        }
        res.send(responseFormatter({ products: community }, 1, "Community data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.searchCommunities = async (req, res) => {
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
        const response = await Community.count({ communityName: new RegExp('^' + searchTerm, "i"), ...filters });
        // "members.memberDetails": { $nin: [id] }
        const data = {
            products: await Community.find({ communityName: new RegExp('^' + searchTerm, "i"), ...filters }).skip(noOfRecordsToSkip).limit(limit),
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

exports.getAllCommunities = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10,
        page = !isNaN(req.query.page) ? Number(req.query.page) : 1
    let filters = {};
    try {
        filters = req.query.filters ? getFilterObject(JSON.parse(req.query.filters)) : {};
        const noOfRecordsToSkip = page > 0 ? ((page - 1) * limit) : 0;
        const response = await Community.count(filters);
        const data = {
            products: await Community.find(filters).skip(noOfRecordsToSkip).limit(limit),
            pageInfo: {
                page,
                size: limit,
                totalCount: Number(response.toFixed())
            }
        }
        res.send(responseFormatter(data, 1, "Communities list"))
    } catch (e) {
        res.send(responseFormatter(e, 0, "Something went wrong"))
    }
}

exports.getCommunityByRange = async (req, res) => {
    const limit = !isNaN(req.query.size) ? Number(req.query.size) : 10;

    try {
        var id = mongoose.Types.ObjectId(req._id);
        let community = await Community.find({
            rangeCoordinates: {
                $near: {
                    $maxDistance: 3000,
                    $geometry: {
                        type: "Point",
                        coordinates: [req.body.long, req.body.lat]
                    }
                }
            },
            "members.memberDetails": {
                $nin: [id]
            }
        }).limit(limit)
        if (!community) {
            res.send(responseFormatter(null, 0, 'Community not found'));
            return;
        }
        res.send(responseFormatter(community, 1, "Community data"))
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.createPost = async (req, res) => {
    const title = req.body.title,
        description = req.body.description,
        image = req.body.image,
        communityId = req.body.communityId || '',
        createdBy = req._id;

    try {
        const post = new Posts({
            title,
            description,
            image,
            createdBy,
            comments: []
        })
        post.save().then((data) => {
            Community.findOneAndUpdate(
                { _id: communityId },
                { $push: { posts: [data._id] } },
                function(err, result) {
                    console.log(err)
                if (err) {
                    res.send(responseFormatter(err.errors, 0, err.name))
                } else {
                    console.log(`communities/${result.fbCollectionId}/posts/${data._id}`)
                    global.fireDb.collection("communities").doc(result.fbCollectionId).collection('posts').doc(data._id.toString()).set({
                        title,
                        description,
                        image,
                        createdBy,
                        createdAt: Date.now()
                    }, {merge: true}).then((fbdata) => {
                        res.send(responseFormatter(data, 1, "Post Created"))
                    })
                    .catch((error) => {
                        res.send(responseFormatter(error, 0, "Unable to create post" + result.fbCollectionId))
                    });
                }
                }
            );
        }).catch((err) => {
            res.send(responseFormatter(err, 0, ''))
        })
    } catch(err) {
        console.log(err)
        res.send(responseFormatter(err, 0, ''))
    }
}

exports.addComment = async (req, res) => {
    const comment = req.body.comment,
        postId = req.body.postId,
        fbCollectionId = req.body.fbCollectionId,
        userInfo = req._id;

    try {
        const commentObj = new Comments({
            comment,
            userInfo
        })
        commentObj.save().then((data) => {
            console.log('comment =>', data);
            Posts.findOneAndUpdate(
                { _id: postId },
                { $push: { comments: [data._id] } },
                function(err, result) {
                    console.log(err)
                if (err) {
                    res.send(responseFormatter(err.errors, 0, err.name))
                } else {
                    global.fireDb.collection("communities").doc(fbCollectionId).collection('posts').doc(postId).collection('comments').add({
                        comment,
                        userInfo,
                        createdAt: Date.now()
                    }, {merge: true}).then((fbdata) => {
                        res.send(responseFormatter(data, 1, "Comment Added"))
                    })
                    .catch((error) => {
                        res.send(responseFormatter(error, 0, "Unable to add comment" + result.fbCollectionId))
                    });
                }
                }
            );
        }).catch((err) => {
            res.send(responseFormatter(err, 0, ''))
        })
    } catch(err) {
        console.log(err)
        res.send(responseFormatter(err, 0, ''))
    }
}

exports.changeRole = async (req, res) => {
    const memberId = req.body.memberId,
        communityId = req.body.communityId,
        admin = req.body.admin || false;
        
    try {
        Community.findOneAndUpdate(
            { _id: communityId },
            { $set: { ["members.$[mid].admin"] : admin }},
            { arrayFilters: [{ 'mid.memberDetails': memberId }]},
            function(err, result) {
                if (err) {
                    res.send(responseFormatter(err.errors, 0, err.name))
                } else {
                    global.fireDb.collection("communities").doc(result.fbCollectionId).get().then((data) => {
                        let members = data.data().members;
                        members = members.map(item => {
                            if(item.memberDetails == memberId) {
                                item.admin = admin
                            }
                            return item;
                        })
                        global.fireDb.collection("communities").doc(result.fbCollectionId).update({
                            members: members
                        }).then((udata) => {
                            res.send(responseFormatter(udata, 1, "User role changed"))
                        })
                        .catch((error) => {
                            res.send(responseFormatter(error, 0, "Unable to update in the firebase" + result.fbCollectionId))
                        });
                    }).catch((error) => {
                        res.send(responseFormatter(error, 0, "Unable to update in the firebase" + result.fbCollectionId))
                    });
                }
            }
        );
    } catch(err) {
        console.log(err)
        res.send(responseFormatter(err, 0, ''))
    }
}