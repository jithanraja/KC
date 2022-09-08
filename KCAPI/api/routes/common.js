var express = require("express");
var router = express.Router();
var controller = require("../controllers/common");
var bodyParser = require("body-parser");
const { AuthValidator } = require("../services");
var jsonParser = bodyParser.json();

/***
 * @swagger
 * /api/common:
 *  get:
 *      summary: Common Get Call
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: '{ data: [], success: boolean }'
 */
 router.get(
    "/",
    jsonParser,
    controller.getResponse
  );
  
  /***
   * @swagger
   * /api/common/generateTestToken:
   *  get:
   *      summary: Get test token call
   *      tags:
   *          - Common
   *      responses:
   *          '200':
   *              description: post
   */
  router.get("/generateTestToken", controller.generateToken);

  /***
   * @swagger
   * /api/common/SendMail:
   *  post:
   *      summary: Send mail
   *      parameters:
   *         - in: formData
   *           name: mailTo
   *           type: string
   *           required: true
   *         - in: formData
   *           name: type
   *           type: string
   *           enum: ['text', 'html']
   *           required: true
   *         - in: formData
   *           name: subject
   *           type: string
   *           required: true
   *         - in: formData
   *           name: content
   *           description: Type:Text => Actual Content Else, Type:HTML => Template Name
   *           type: string
   *         - in: formData
   *           name: macros
   *           type: string
   *           default: {}
   *           description: Only for type HTML
   *         - in: formData
   *           name: mailFrom
   *           type: string
   *           description: To overwrite default from mail address
   *      tags:
   *          - Common
   *      responses:
   *          '200':
   *              description: post
   */
   router.post("/SendMail", controller.sendMail);

   /***
   * @swagger
   * /api/common/devTestAPI:
   *  post:
   *      summary: DEV Test
   *      tags:
   *          - Common
   *      responses:
   *          '200':
   *              description: post
   */
    router.post("/devTestAPI", controller.devTestAPI);   

  /***
   * @swagger
   * /api/common/search:
   *  post:
   *      summary: Common Search
   *      parameters:
   *         - in: header
   *           name: x-access-token
   *           type: string
   *           required: true
   *         - in: formData
   *           name: searchTerm
   *           type: string
   *           required: true
   *      tags:
   *          - Common
   *      responses:
   *          '200':
   *              description: post
   */
     router.post("/search", [AuthValidator, jsonParser], controller.dashboardSearch);   

  module.exports = router;