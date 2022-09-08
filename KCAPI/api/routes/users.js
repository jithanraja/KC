var express = require("express");
var router = express.Router();
var controller = require("../controllers/users");
var bodyParser = require("body-parser");
const { FBAuthValidator } = require("../services");
var jsonParser = bodyParser.json();

 /***
   * @swagger
   * /api/users/login:
   *  post:
   *      summary: User Login Post Call
   *      parameters:
   *         - in: formData
   *           name: email
   *           type: string
   *           description: email/phonenumber
   *           required: true
   *         - in: formData
   *           name: password
   *           type: string
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
  router.post("/login", jsonParser, controller.login);

  /***
   * @swagger
   * /api/users/forgotPassword:
   *  post:
   *      summary: User forgot password post Call
   *      parameters:
   *         - in: formData
   *           name: email
   *           type: string
   *           description: email/phonenumber
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
   router.post("/forgotPassword", jsonParser, controller.forgotPassword);

   /***
   * @swagger
   * /api/users/verifyOtp:
   *  post:
   *      summary: Verify Otp post Call
   *      parameters:
   *         - in: formData
   *           name: otp
   *           type: string
   *           required: true
   *         - in: formData
   *           name: identifier
   *           type: string
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
    router.post("/verifyOtp", jsonParser, controller.verifyOtp);

    /***
   * @swagger
   * /api/users/resetPassword:
   *  post:
   *      summary: User password reset post Call
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: updatedPassword
   *           type: string
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
  router.post("/resetPassword", FBAuthValidator, controller.resetPassword);

  /***
   * @swagger
   * /api/users/register:
   *  post:
   *      summary: User Register Post Call
   *      parameters:
   *         - in: body
   *           name: body
   *           type: object
   *           example: {userData: { displayName: string, email: string, password: string, phoneNumber: number, photoURL: url}}
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
   router.post("/register", jsonParser, controller.register);

   /***
   * @swagger
   * /api/users/updateProfile:
   *  put:
   *      summary: User Update Put Call
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: body
   *           type: object
   *           example: {userData: { displayName: string, email: string, password: string, phoneNumber: number, photoURL: url}}
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
  router.put("/updateProfile", FBAuthValidator, controller.updateProfile);

  /***
   * @swagger
   * /api/users/getProfile:
   *  get:
   *      summary: User Profile get Call
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *      tags:
   *          - Users
   *      responses:
   *          '200':
   *              description: Test
   */
   router.get("/getProfile", FBAuthValidator, controller.getProfile);

  /***
   * @swagger
   * /api/users/googleRegisterAndLogin:
   *  post:
   *      summary: Google Register
   *      description: This can't be do it in here, Please try with mobile app 
   *      tags:
   *          - Users
   */
   router.post("/googleRegisterAndLogin", jsonParser, controller.googleRegisterAndLogin);

  module.exports = router;