var express = require("express");
var router = express.Router();
var controller = require("../controllers/admin");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
   * @swagger
   * /api/admin/login:
   *  post:
   *      summary: Admin Login
   *      parameters:
   *         - in: formData
   *           name: username
   *           type: string
   *           required: true
   *         - in: formData
   *           name: password
   *           type: string
   *           required: true
   *      tags:
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
  router.post("/login", jsonParser, controller.login);

/***
   * @swagger
   * /api/admin/createUser:
   *  post:
   *      summary: Create new admin user
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: firstName    
   *           required: true
   *           type: string
   *         - in: formData
   *           name: lastName
   *           type: string
   *           required: true
   *         - in: formData
   *           name: role
   *           type: string
   *           enum: ['superadmin', 'storeadmin', 'productadmin', 'user', 'admin']
   *           required: true
   *         - in: formData
   *           name: mobileNo
   *           type: string
   *           required: true
   *         - in: formData
   *           name: altMobileNo
   *           type: string
   *         - in: formData
   *           name: username
   *           type: string
   *           required: true
   *         - in: formData
   *           name: password
   *           type: string
   *           required: true
   *         - in: formData
   *           name: profileImage
   *           type: string
   *      tags:
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
   router.post("/createUser", AuthValidator, controller.register);

/***
   * @swagger
   * /api/admin/updateUser/{id}:
   *  put:
   *      summary: Update admin user by ID
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
   *           name: firstName    
   *           type: string
   *         - in: formData
   *           name: lastName
   *           type: string
   *         - in: formData
   *           name: role
   *           type: string
   *           enum: ['', 'superadmin', 'storeadmin', 'productadmin', 'user', 'admin']
   *         - in: formData
   *           name: mobileNo
   *           type: string
   *         - in: formData
   *           name: altMobileNo
   *           type: string
   *         - in: formData
   *           name: username
   *           type: string
   *         - in: formData
   *           name: password
   *           type: string
   *         - in: formData
   *           name: profileImage
   *           type: string
   *         - in: formData
   *           name: isActive
   *           type: boolean
   *           default: true
   *      tags:
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
    router.put("/updateUser/:id", AuthValidator, controller.update);

/***
   * @swagger
   * /api/admin/getUserById/{id}:
   *  get:
   *      summary: Get an user by ID
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
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
    router.get("/getUserById/:id", AuthValidator, controller.getUserById);

/***
   * @swagger
   * /api/admin/getAllUsers:
   *  get:
   *      summary: Get all users
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
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
 router.get("/getAllUsers", [AuthValidator, jsonParser], controller.getAllUsers);

 /***
   * @swagger
   * /api/admin/getCurrentUser:
   *  get:
   *      summary: Get an user by token
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - Admin
   *      responses:
   *          '200':
   *              description: Test
   */
  router.get("/getCurrentUser", AuthValidator, controller.getCurrentUser);

module.exports = router;