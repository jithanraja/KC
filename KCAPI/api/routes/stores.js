var express = require("express");
var router = express.Router();
var controller = require("../controllers/stores");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/stores/createStore:
   *  post:
   *      summary: Create new store
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           required: true,
   *           schema:
   *             $ref: '#/definitions/Store'
   *      tags:
   *          - Stores
   *      responses:
   *          '200':
   *              description: Test
   */
   router.post("/createStore", AuthValidator, controller.create);

/***
   * @swagger
   * /api/stores/updateStore/{id}:
   *  put:
   *      summary: Update category by ID
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: path
   *           name: id
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           required: true,
   *           schema:
   *             $ref: '#/definitions/Store'
   *      tags:
   *          - Stores
   *      responses:
   *          '200':
   *              description: Test
   */
    router.put("/updateStore/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/stores/getStoreById/{id}:
   *  get:
   *      summary: Get an category by ID
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: path
   *           name: id
   *           type: string
   *           required: true
   *      tags:
   *          - Stores
   *      responses:
   *          '200':
   *              description: Test
   */
    router.get("/getStoreById/:id", AuthValidator, controller.getStoreById);

/***
   * @swagger
   * /api/stores/getAllStores:
   *  get:
   *      summary: Get all categories
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
   *      tags:
   *          - Stores
   *      responses:
   *          '200':
   *              description: Test
   */
 router.get("/getAllStores", [AuthValidator, jsonParser], controller.getAllStores);



module.exports = router;