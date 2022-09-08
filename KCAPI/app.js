var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var app = express();

app.use(cors())

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static("uploads"))
app.use('/uploads', express.static('uploads'));
app.set("secretKey", "kc-jwt-s3c63t");

module.exports = app;
