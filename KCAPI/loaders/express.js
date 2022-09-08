var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var routes = require("../api");
var indexroutes = require("../api/routes/index");
var config = require("../config");
var cookieParser = require("cookie-parser");
var app = require("../app");
var createError = require("http-errors");
var fs = require('fs');
var path = require('path');
/*
  var rfs = require('rotating-file-stream')
 */
/**
 * Health Check endpoints
 * @TODO Explain why they are here
 */
app.get("/status", (req, res) => {
  res.status(200).end();
});
app.head("/status", (req, res) => {
  res.status(200).end();
});

var morgan = require("morgan");
const { errorHandler } = require("../api/services");

morgan.token('res-body', (_req, res) =>
  JSON.stringify(res.body),
)

// var accessLogStream = rfs.createStream('access.log', { interval: '1d',path: path.join(__dirname, '../public/log') })

/*app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
},{ stream: accessLogStream }));
app.use(morgan('common', { stream: accessLogStream }));

morgan.token('postData', (request) => {
  if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
  else return ' ';
});
const originalSend = app.response.send;
app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body)
  this.__custombody__ = body
}

morgan.token('res-body', (_req, res) =>
  JSON.stringify(res.__custombody__),
)
app.use(
  morgan(
    '-------------------------\n :date :method :url :status :res[content-length] - :response-time ms :postData :res-body -------------------------\n', { stream: accessLogStream }
  )
);*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// It shows the real origin IP in the heroku or Cloudwatch logs
app.enable("trust proxy");

// The magic package that prevents frontend developers going nuts
// Alternate description:
// Enable Cross Origin Resource Sharing to all origins by default
var corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());

// Some sauce that always add since 2014
// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
// Maybe not needed anymore ?
//app.use(require('method-override')());

// Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());

//Load Swagger
console.log("Loading Swagger");
require("./swagger")(app);
console.log("Loading Swagger Completed");

// Load API routes
console.log("Loading Routes");
app.use("/", indexroutes);
app.use(config.API_PREFIX, routes);
console.log("Loading Routes Completed");
// app.use(express.static("uploads"))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

