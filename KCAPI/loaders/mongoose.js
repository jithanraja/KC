const mongoose = require("mongoose");
var config = require("../config");

(async () => {
  try {
    console.log("Trying to Connect : " + config.databaseURL);
    mongoose.Promise = global.Promise;
    await mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log("error: " + err);
  }
})();
