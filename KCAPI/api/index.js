var express = require("express");
var router = express.Router();

router.use("/", require("./routes/index"));
router.use("/common", require("./routes/common"));
router.use("/common", require("./routes/upload"));
router.use("/users", require("./routes/users"));
router.use("/lists", require("./routes/lists"));
router.use("/stores", require("./routes/stores"));
router.use("/admin", require("./routes/admin"));
router.use("/categories", require("./routes/category"));
router.use("/friends", require("./routes/friends"));
router.use("/products", require("./routes/products"));
router.use("/orders", require("./routes/orders"));
router.use("/coupons", require("./routes/coupons"));
router.use("/collections", require("./routes/collections"));
router.use("/community", require("./routes/community"));

module.exports = router;