var express = require("express");
var router = express.Router();
var controller = require("../controllers/products");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/products/createProduct:
   *  post:
   *      summary: Create new Product
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           required: true,
   *           schema:
   *             $ref: '#/definitions/Product'
   *      tags:
   *          - Products
   *      responses:
   *          '200':
   *              description: Product Test
   */
router.post("/createProduct", AuthValidator, controller.create);

/***
   * @swagger
   * /api/products/updateProduct/{id}:
   *  put:
   *      summary: Update Product by ID
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
   *             $ref: '#/definitions/Product'
   *      tags:
   *          - Products
   *      responses:
   *          '200':
   *              description: Product Test
   */
router.put("/updateProduct/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/products/getProductById/{id}:
   *  get:
   *      summary: Get an product by ID
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
   *          - Products
   *      responses:
   *          '200':
   *              description: Product Test
   */
router.get("/getProductById/:id", AuthValidator, controller.getProductById);

/***
   * @swagger
   * /api/products/getAllProducts:
   *  get:
   *      summary: Get all products
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
   *          - Products
   *      responses:
   *          '200':
   *              description: Product Test
   */
router.get("/getAllProducts", [AuthValidator, jsonParser], controller.getAllProducts);

/***
   * @swagger
   * /api/products/search:
   *  get:
   *      summary: search all products by product name
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
   *          - Products
   *      responses:
   *          '200':
   *              description: Product Test
   */
 router.get("/search", [AuthValidator, jsonParser], controller.searchProducts);

module.exports = router;