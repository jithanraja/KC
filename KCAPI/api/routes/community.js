var express = require("express");
var router = express.Router();
var controller = require("../controllers/community");
var bodyParser = require("body-parser");
const { FBAuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/community:
   *  post:
   *      summary: Community create Post Call
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           type: object
   *           required: true
   *           example: {communityName: string, isPrivate: boolean, postByAdminOnly: boolean, image: url, rangeInKm: number, rangeCoordinates: {lat: Number, lang: Number}}
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Test
   */
 router.post("/", FBAuthValidator, controller.create);


/***
   * @swagger
   * /api/community/myCommunities:
   *  get:
   *      summary: Get an Community by ID
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
 router.get("/myCommunities", FBAuthValidator, controller.getMyCommunity);

 /***
   * @swagger
   * /api/community/getAllCommunities:
   *  get:
   *      summary: Get all Communities
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: query
   *           name: size
   *           type: number
   *           default: 10
   *         - in: query
   *           name: page    
   *           type: number
   *           default: 1
   *         - in: query
   *           name: filters    
   *           type: string
   *           default: [{"key": "<keyValue>", "value": "<Value>"}]
   *           example: [{"key": "isActive", "value": true}]
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
  router.get("/getAllCommunities", FBAuthValidator, controller.getAllCommunities);

 /***
   * @swagger
   * /api/community/getCommunityByRange:
   *  post:
   *      summary: Get an Community by Range
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: query
   *           name: size
   *           type: number
   *           default: 10
   *         - in: body
   *           name: body
   *           type: object
   *           required: true
   *           example: {long: Number, lat: Number}
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
  router.post("/getCommunityByRange", FBAuthValidator, controller.getCommunityByRange);

  /***
   * @swagger
   * /api/community/getCommunityByUserId:
   *  post:
   *      summary: Get an Community by Range
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: query
   *           name: id
   *           type: string
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
   router.post("/getCommunityByUserId", FBAuthValidator, controller.getCommunityByUserId);

/***
   * @swagger
   * /api/community/search:
   *  get:
   *      summary: search all Communities
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: query
   *           name: size
   *           type: number
   *           default: 10
   *         - in: query
   *           name: page    
   *           type: number
   *           default: 1
   *         - in: query
   *           name: searchTerm  
   *           type: string
   *         - in: query
   *           name: filters    
   *           type: string
   *           default: [{"key": "<keyValue>", "value": "<Value>"}]
   *           example: [{"key": "isActive", "value": true}]
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
 router.get("/search", FBAuthValidator, controller.searchCommunities);

 /***
   * @swagger
   * /api/community/joinOrRequestToCommunity:
   *  post:
   *      summary: search all Communities
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: formData
   *           name: communityId
   *           type: string
   *         - in: formData
   *           name: invitedBy
   *           type: string
   *         - in: formData
   *           name: joinType
   *           type: string
   *           enum: ['join', 'request']
   *         - in: formData
   *           name: memberId
   *           description: member id is needed only for the 'request' join type
   *           type: string
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
  router.post("/joinOrRequestToCommunity", FBAuthValidator, controller.joinOrRequestToCommunity);

 /***
   * @swagger
   * /api/community/getCommunityMembers:
   *  post:
   *      summary: get community members
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: formData
   *           name: memberIds
   *           type: string
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
   router.post("/getCommunityMembers", FBAuthValidator, controller.getCommunityMembers);

  /***
   * @swagger
   * /api/community/createPost:
   *  post:
   *      summary: create post
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: formData
   *           name: title
   *           type: string
   *           required: true
   *         - in: formData
   *           name: description
   *           type: string
   *           required: true
   *         - in: formData
   *           name: image
   *           type: string
   *           required: true
   *         - in: formData
   *           name: communityId
   *           type: string
   *           required: true
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
    router.post("/createPost", FBAuthValidator, controller.createPost);

  /***
   * @swagger
   * /api/community/addComment:
   *  post:
   *      summary: add comment to the post
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: formData
   *           name: comment
   *           type: string
   *           required: true
   *         - in: formData
   *           name: postId
   *           type: string
   *           required: true
   *         - in: formData
   *           name: fbCollectionId
   *           type: string
   *           required: true
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
   router.post("/addComment", FBAuthValidator, controller.addComment);

   /***
   * @swagger
   * /api/community/changeRole:
   *  post:
   *      summary: change role of an member list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *         - in: formData
   *           name: admin
   *           type: boolean
   *           required: true
   *         - in: formData
   *           name: memberId
   *           type: string
   *           required: true
   *         - in: formData
   *           name: communityId
   *           type: string
   *           required: true
   *      tags:
   *          - Community
   *      responses:
   *          '200':
   *              description: Product Test
   */
    router.post("/changeRole", FBAuthValidator, controller.changeRole);

 module.exports = router;
 