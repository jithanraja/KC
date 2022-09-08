const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config");
const util = require("util");
const Multer = require("multer");
let processFile = Multer({
  storage: Multer.memoryStorage()
}).single("file");
let processFileMiddleware = util.promisify(processFile);

function AuthValidator(req, res, next) {
    jwt.verify(
        req.headers["x-access-token"],
        req.app.get("secretKey"),
        function (err, decoded) {
            if (err) {
                res.send(responseFormatter(null, 0, err.message));
            } else {
                req.currentUser = decoded;
                next()
                // res.send(responseFormatter(null, 0, "Invalid Token " + req.headers["x-access-token"]));
            }
        }
    );
}

function FBAuthValidator(req, res, next) {
    jwt.verify(
        req.headers["x-access-token"],
        req.app.get("secretKey"),
        function (err, decoded) {
            if (err) {
                res.send(responseFormatter(null, 0, err.message));
            } else {
                req.uid = decoded.uid;
                req._id = decoded._id;
                if(decoded.otp) {
                    req.otpMode = true;
                }
                next()
                // res.send(responseFormatter(null, 0, "Invalid Token " + req.headers["x-access-token"]));
            }
        }
    );
}


function getFormattedPhoneNumber(value) {
    let newVal = value.replace(/\D/g, "");
    if (newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
        newVal = "";
    } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, "($1)");
    } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
    } else if (newVal.length <= 10) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) $2-$3");
    } else {
        newVal = newVal.substring(0, 10);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) $2-$3");
    }
    return newVal;
}

function numberToTimeFormat(hours) {
    if (isNaN(hours)) {
        hours = 0;
    }
    var decimal = hours - Math.floor(hours);
    var hours = hours - decimal;
    var minutes = Math.floor(hours / 60);
    if (isNaN(minutes)) {
        minutes = 0;
    }
    decimal = decimal.toFixed(2);
    var decimalparts = (decimal + "").split(".");
    decimal = parseFloat(decimalparts[1]);
    minutes += decimal;
    if (minutes > 60) {
        minutes = minutes - 60;
        hours++;
    }
    var seconds = 0;
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ":" + minutes + ":" + seconds;
}

function getFormattedDate(date, type = "y", format = "") {
    if (date == null) return null;
    var month_names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if (format == "d") date = new Date(date);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    var month_index = date.getMonth();
    var time = date.getTime();
    month = month.length > 1 ? month : "0" + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    if (type != "d" && type != "t") return year + "-" + month + "-" + day;
    else if (type == "t")
        return (day + "-" + month_names[month_index] + "-" + year + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    else return day + "-" + month_names[month_index] + "-" + year;
}

async function SendMail(
    mailTo,
    mailSubject,
    mailHTML,
    mailTemplate = "text",
    mailfrom = ""
) {
    var api_key = config.mailApiKey;
    var domain = config.mailDomain;
    var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
    if (mailTemplate != "text") {
        var data = {
            from: mailfrom != "" ? mailfrom : config.mailFrom,
            to: mailTo,
            subject: mailSubject,
            template: mailTemplate,
            "X-Mailgun-Variables": mailHTML,
        };
    } else {
        var data = {
            from: mailfrom != "" ? mailfrom : config.mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailHTML,
        };
    }
    const resp = await mailgun.messages().send(data);
    console.log("send Mail response => ", resp)
    return resp;
}

async function SendSMS(phoneNo, text = "") {
    const accountSid = config.smsAccountSid;
    const authToken = config.smsAuthToken;
    const client = require("twilio")(accountSid, authToken);
    const response = await client.messages
        .create({ from: config.smsFrom, body: text, to: phoneNo })
    console.log(response);
    return response;
        // .then(
        //     (message) => {
        //         console.log(message);
        //         return {
        //             Status: "Success",
        //             Message: message.sid,
        //         };
        //     },
        //     (err) => {
        //         return {
        //             Status: "Error",
        //             Message: err,
        //         };
        //     }
        // );
}

function responseFormatter(data, status = 0, message = "") {
    if (status == 1 || status == 200) {
        OutputData = {
            status: true,
            data: data,
            message: message,
        };
    } else {
        OutputData = {
            status: false,
            data: data,
            message: message,
        };
    }
    return OutputData;
}

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

function getFilterObject(filter = []) {
    const filterObj = {};
    for(let i = 0; i < filter.length; i++) {
        filterObj[filter[i].key] = filter[i].value;
    }
    return filterObj;
}

const { check } = require('express-validator');
const { OtpModel } = require("./models");
  
function validateEmail(mailId) { 
    return check(mailId)
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid email')
        // .custom(async (email) => {
        //     const existingUser = 
        //         await repo.getOneBy({ email })
                  
        //     if (existingUser) {
        //         throw new Error('Email already in use')
        //     }
        // })
}

function get(object, path, defaultValue) {
    const result = object == null ? undefined : baseGet(object, path)
    return result === undefined ? defaultValue : result
}

function baseGet(object, path) {
    path = castPath(path, object)
  
    let index = 0
    const length = path.length
  
    while (object != null && index < length) {
      object = object[toKey(path[index++])]
    }
    return (index && index == length) ? object : undefined
}

function castPath(value, object) {
    if (Array.isArray(value)) {
      return value
    }
    return isKey(value, object) ? [value] : stringToPath(value)
}

const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/

function isKey(value, object) {
    if (Array.isArray(value)) {
      return false
    }
    const type = typeof value
    if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
      return true
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object))
}

function isSymbol(value) {
    const type = typeof value
    return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

const toString = Object.prototype.toString

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

const INFINITY = 1 / 0

function toKey(value) {
  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g')

const stringToPath = memoizeCapped((string) => {
  const result = []
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('')
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match
    if (quote) {
      key = subString.replace(reEscapeChar, '$1')
    }
    else if (expression) {
      key = expression.trim()
    }
    result.push(key)
  })
  return result
})

const MAX_MEMOIZE_SIZE = 500
function memoize(func, resolver) {
    if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
      throw new TypeError('Expected a function')
    }
    const memoized = function(...args) {
      const key = resolver ? resolver.apply(this, args) : args[0]
      const cache = memoized.cache
  
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.apply(this, args)
      memoized.cache = cache.set(key, result) || cache
      return result
    }
    memoized.cache = new (memoize.Cache || Map)
    return memoized
}
  
memoize.Cache = Map

function memoizeCapped(func) {
  const result = memoize(func, (key) => {
    const { cache } = result
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear()
    }
    return key
  })

  return result
}

const genOtp = (length = 6) => {
    return Math.floor(Math.random() * (Math.pow(10, length - 1) * 9)) + Math.pow(10, length - 1);
};
  
const generateOtp = (identifier, expiresIn, length = 6) => {
    const otp = genOtp(length);
    const addTime = expiresIn ? Number(expiresIn) : 30;
    const expiresAt = new Date().setMinutes(new Date().getMinutes() + addTime);
    return new Promise((resolve, reject) => {
        OtpModel.create({
            identifier,
            otp,
            expiresAt,
            status: 'unuse'
        })
        .then((doc) => {
            resolve(doc);
        })
        .catch((error) => reject(error));
    });
};

const verifyOtp = (identifier, otp) => {
    return new Promise((resolve, reject) => {
        OtpModel.findOne({ identifier, otp }, (error, doc) => {
        if (error || !doc) reject(error);
        else {
            if (doc.status === 'used') reject(new Error('otp already used'));
            else {
            
            doc.status = 'used';
            doc.save();
            resolve(doc);
            }
        }
        });
    });
};

module.exports = {
    AuthValidator,
    getFormattedPhoneNumber,
    responseFormatter,
    SendSMS,
    SendMail,
    numberToTimeFormat,
    getFormattedDate,
    errorHandler,
    getFilterObject,
    validateEmail,
    FBAuthValidator,
    get,
    generateOtp,
    verifyOtp,
    processFileMiddleware
}