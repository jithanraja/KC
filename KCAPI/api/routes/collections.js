var express = require("express");
var router = express.Router();
var controller = require("../controllers/collections");
const { AuthValidator } = require("../services");

/***
   * @swagger
   * /api/collections/deleteCollection/{id}:
   *  delete:
   *      summary: Delete the entire collection
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: path
   *           name: id
   *           type: string
   *           enum: ['', 'categories', 'products', 'coupons', 'counters', 'adminusers', 'stores']
   *           required: true
   *      tags:
   *          - Collections
   *      responses:
   *          '200':
   *              description: Test
   */
    router.delete("/deleteCollection/:id", AuthValidator, controller.delete);

/***
   * @swagger
   * /api/collections/getAllCollections:
   *  get:
   *      summary: Get all Collections
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           required: true
   *           type: string
   *      tags:
   *          - Collections
   *      responses:
   *          '200':
   *              description: Test
   */
 router.get("/getAllCollections", [AuthValidator], controller.getAllCollection);



module.exports = router;