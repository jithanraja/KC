const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  otp: 'number',
  identifier: 'string',
  expires_at: 'date',
  status: 'string' // used, unuse
});

const OtpModel = mongoose.model('otps', OtpSchema);
module.exports = OtpModel

