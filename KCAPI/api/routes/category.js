var express = require("express");
var router = express.Router();
var controller = require("../controllers/category");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();


/***
   * @swagger
   * /api/categories/createCategory:
   *  post:
   *      summary: Create new category
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: categoryName    
   *           required: true
   *           type: string
   *         - in: formData
   *           name: categoryImage
   *      tags:
   *          - Categories
   *      responses:
   *          '200':
   *              description: Test
   */
   router.post("/createCategory", AuthValidator, controller.create);

/***
   * @swagger
   * /api/categories/updateCategory/{id}:
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
   *         - in: formData
   *           name: categoryName    
   *           required: true
   *           type: string
   *         - in: formData
   *           name: categoryImage
   *           type: string
   *         - in: formData
   *           name: status
   *           type: boolean
   *           default: true
   *      tags:
   *          - Categories
   *      responses:
   *          '200':
   *              description: Test
   */
    router.put("/updateCategory/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/categories/getCategoryById/{id}:
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
   *          - Categories
   *      responses:
   *          '200':
   *              description: Test
   */
    router.get("/getCategoryById/:id", AuthValidator, controller.getCategoryById);

/***
   * @swagger
   * /api/categories/getAllCategories:
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
   *          - Categories
   *      responses:
   *          '200':
   *              description: Test
   */
 router.get("/getAllCategories", [AuthValidator, jsonParser], controller.getAllCategories);



module.exports = router;