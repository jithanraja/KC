var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const { AuthValidator, processFileMiddleware } = require("../services");
var jsonParser = bodyParser.json();
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ projectId: 'konnectcart', keyFilename: "konnectcart-firebase-adminsdk.json" });
const bucket = storage.bucket("konnectcart.appspot.com");

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: 'uploads'
});

const categoryMultipart = multipart({
    uploadDir: 'uploads/categories'
});

const productsMultipart = multipart({
    uploadDir: 'uploads/products'
});

/***
 * @swagger
 * /api/common/upload:
 *  post:
 *      summary: Upload general files
 *      parameters:
 *         - in: header
 *           name: x-access-token
 *           type: string
 *           required: true
 *         - in: formData
 *           name: uploads[]
 *           type: file
 *           required: true
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: post
 */
router.post('/upload', [AuthValidator, multipartMiddleware, jsonParser], (req, res) => {
    res.json({
        'status': true,
        'path': req.files.uploads[0].path
    });
});

/***
 * @swagger
 * /api/common/categories/upload:
 *  post:
 *      summary: Upload categories images
 *      parameters:
 *         - in: header
 *           name: x-access-token
 *           type: string
 *           required: true
 *         - in: formData
 *           name: uploads[]
 *           type: file
 *           required: true
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: post
 */
 router.post('/categories/upload', [AuthValidator, categoryMultipart, jsonParser], (req, res) => {
    res.json({
        'status': true,
        'path': req.files.uploads[0].path
    });
});

/***
 * @swagger
 * /api/common/products/upload:
 *  post:
 *      summary: Upload products images
 *      parameters:
 *         - in: header
 *           name: x-access-token
 *           type: string
 *           required: true
 *         - in: formData
 *           name: uploads[]
 *           type: file
 *           required: true
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: post
 */
 router.post('/products/upload', [AuthValidator, productsMultipart, jsonParser], (req, res) => {
    res.json({
        'status': true,
        'path': req.files.uploads[0].path
    });
});

/***
 * @swagger
 * /api/common/fb/upload:
 *  post:
 *      summary: Upload firebase images
 *      parameters:
 *         - in: formData
 *           name: file
 *           type: file
 *           required: true
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: post
 */
 router.post('/fb/upload', [processFileMiddleware], async(req, res) => {
    try {
        if (!req.file) {
          return res.status(400).send({ 'status': false, message: "Please upload a file!" });
        }
        // Create a new blob in the bucket and upload the file data.
        const key = Date.now();
        const blob = bucket.file(`${key}-` + req.file.originalname);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        blobStream.on("error", (err) => {
          res.status(500).send({ 'status': false, message: err.message });
        });
        blobStream.on("finish", async (data) => {
          // Create URL for directly file access via HTTP.
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          try {
            // Make the file public
            await bucket.file(`${key}-` + req.file.originalname).makePublic();
          } catch(er) {
            return res.status(500).send({
              message:
                `Uploaded the file successfully, but public access is denied! ${JSON.stringify(er)}`,
              url: publicUrl,
              'status': true,
            });
          }
          res.status(200).send({
            message: "Uploaded the file successfully",
            url: publicUrl,
            'status': true
          });
        });
        blobStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).send({
            'status': false,
            message: `Could not upload the file: ${req}. ${err}`,
        });
    }
});

/***
 * @swagger
 * /api/common/downloadFile:
 *  get:
 *      summary: download file
 *      parameters:
 *         - in: header
 *           name: x-access-token
 *           type: string
 *           required: true
 *         - in: query
 *           name: filepath
 *           type: string
 *           required: true
 *      tags:
 *          - Common
 *      responses:
 *          '200':
 *              description: post
 */
router.get('/downloadFile', [ AuthValidator ],  (req, res) => {
    let filename = req.query.filepath;
    res.download("uploads/" + filename);
})

// router.get('/GetAllfiles', (req, res) => {
//     fs.readdir("./uploads", (err, files) => {
//         for (let i = 0; i < files.length; ++i) {
//             files[i] = Config.APIUrl + "/downloadFile/" + files[i];
//         }

//         res.send(files);
//     })
// })

// router.post('/download', jsonParser, (req, res) => {

//     var filePath = path.resolve(DIR, req.body.filename);
//     //console.log(filePath)
//     res.sendFile(filePath);
// })

module.exports = router;