var express = require("express");
var router = express.Router();
var controller = require("../controllers/friends");
var bodyParser = require("body-parser");
const { FBAuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/friends/addFriend:
   *  post:
   *      summary: Add friend
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: fId
   *           type: string
   *           required: true
   *      tags:
   *          - FriendsList
   *      responses:
   *          '200':
   *              description: Friends list test
   */
router.post("/addFriend", FBAuthValidator, controller.addFriend);

/***
   * @swagger
   * /api/friends/requestFriend:
   *  post:
   *      summary: Request friend
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: uid
   *           type: string
   *           required: true
   *      tags:
   *          - FriendsList
   *      responses:
   *          '200':
   *              description: Friends list test
   */
 router.post("/requestFriend", FBAuthValidator, controller.requestFriend);

 /***
   * @swagger
   * /api/friends/blockOrUnblock:
   *  post:
   *      summary: Block/Unblock friend
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: fId
   *           type: string
   *           required: true
   *      tags:
   *          - FriendsList
   *      responses:
   *          '200':
   *              description: Friends list test
   */
router.post("/blockOrUnblock", FBAuthValidator, controller.blockOrUnblock);

/***
   * @swagger
   * /api/friends:
   *  get:
   *      summary: Get friends list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - FriendsList
   *      responses:
   *          '200':
   *              description: Friends list test
   */
 router.get("/", FBAuthValidator, controller.getFriends);

module.exports = router;