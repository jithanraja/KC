var express = require("express");
var router = express.Router();
var controller = require("../controllers/coupons");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/coupons/createCoupon:
   *  post:
   *      summary: Create new Coupon
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           name: body
   *           required: true,
   *           schema:
   *             $ref: '#/definitions/Coupon'
   *      tags:
   *          - Coupons
   *      responses:
   *          '200':
   *              description: Coupon Test
   */
router.post("/createCoupon", AuthValidator, controller.create);

/***
   * @swagger
   * /api/coupons/updateCoupon/{id}:
   *  put:
   *      summary: Update coupon by ID
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
   *             $ref: '#/definitions/Coupon'
   *      tags:
   *          - Coupons
   *      responses:
   *          '200':
   *              description: Coupon Test
   */
router.put("/updateCoupon/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/coupons/getCouponById/{id}:
   *  get:
   *      summary: Get an coupon by ID
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
   *          - Coupons
   *      responses:
   *          '200':
   *              description: Coupon Test
   */
router.get("/getCouponById/:id", AuthValidator, controller.getCouponById);

/***
   * @swagger
   * /api/coupons/getAllCoupons:
   *  get:
   *      summary: Get all coupons
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
   *          - Coupons
   *      responses:
   *          '200':
   *              description: Product Test
   */
router.get("/getAllCoupons", [AuthValidator, jsonParser], controller.getAllCoupons);

/***
   * @swagger
   * /api/coupons/searchCoupons:
   *  get:
   *      summary: search all coupons by product name
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
   *          - Coupons
   *      responses:
   *          '200':
   *              description: Coupon Test
   */
 router.get("/searchCoupons", [AuthValidator, jsonParser], controller.searchCoupons);

module.exports = router;