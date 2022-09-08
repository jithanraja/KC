var express = require("express");
var router = express.Router();
var controller = require("../controllers/orders");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/orders/createOrder:
   *  post:
   *      summary: Create new Order
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           required: true,
   *           schema:
   *             $ref: '#/definitions/Order'
   *      tags:
   *          - Orders
   *      responses:
   *          '200':
   *              description: Order Test
   */
router.post("/createOrder", AuthValidator, controller.create);

/***
   * @swagger
   * /api/orders/updateOrder/{id}:
   *  put:
   *      summary: Update Order by ID
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
   *             $ref: '#/definitions/Order'
   *      tags:
   *          - Orders
   *      responses:
   *          '200':
   *              description: Order Test
   */
router.put("/updateOrder/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/orders/getOrderById/{id}:
   *  get:
   *      summary: Get an order by ID
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
   *          - Orders
   *      responses:
   *          '200':
   *              description: Order Test
   */
router.get("/getOrderById/:id", AuthValidator, controller.getOrderById);

/***
   * @swagger
   * /api/orders/getAllOrders:
   *  get:
   *      summary: Get all orders
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
   *          - Orders
   *      responses:
   *          '200':
   *              description: Order Test
   */
router.get("/getAllOrders", [AuthValidator, jsonParser], controller.getAllOrders);

/***
   * @swagger
   * /api/orders/search:
   *  get:
   *      summary: search all orders by order name
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
   *           required: true
   *         - in: query
   *           name: filters    
   *           type: string
   *           default: [{"key": "<keyValue>", "value": "<Value>"}]
   *           example: [{"key": "isActive", "value": true}]
   *      tags:
   *          - Orders
   *      responses:
   *          '200':
   *              description: Order Test
   */
 router.get("/search", [AuthValidator, jsonParser], controller.searchOrders);

module.exports = router;