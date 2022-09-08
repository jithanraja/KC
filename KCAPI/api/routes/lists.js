var express = require("express");
var router = express.Router();
var controller = require("../controllers/lists");
var bodyParser = require("body-parser");
const { FBAuthValidator } = require("../services");

 /***
   * @swagger
   * /api/lists/favorites:
   *  get:
   *      summary: Get favorites list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - Lists
   *      responses:
   *          '200':
   *              description: Test
   */
  router.get("/favorites", FBAuthValidator, controller.getFavList);

  /***
   * @swagger
   * /api/lists/favoritesWithDetails:
   *  get:
   *      summary: Get favorites list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - Lists
   *      responses:
   *          '200':
   *              description: Test
   */
   router.get("/favoritesWithDetails", FBAuthValidator, controller.getFavListDetails);
  
 /***
   * @swagger
   * /api/lists/favorites:
   *  post:
   *      summary: Add product to favorites list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: productId
   *           type: string
   *           required: true 
   *      tags:
   *          - Lists
   *      responses:
   *          '200':
   *              description: Test
   */
  router.post("/favorites", FBAuthValidator, controller.addItemToFavList);

  /***
   * @swagger
   * /api/lists/favorites:
   *  delete:
   *      summary: Add product to favorites list
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: productId
   *           type: string
   *           required: true 
   *      tags:
   *          - Lists
   *      responses:
   *          '200':
   *              description: Test
   */
   router.delete("/favorites", FBAuthValidator, controller.removeItemFromFavList);

   module.exports = router;