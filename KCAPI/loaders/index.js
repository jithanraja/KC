var express = require('express');
var app = require("../app");

const admin = require('firebase-admin');
const serviceAccount = require('./../konnectcart-firebase-adminsdk.json');

if (admin.apps.length === 0) {
  console.log("Initializing Firebase");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  global.fireDb = admin.firestore();
  global.fireAuth = admin.auth();
  global.fireAdmin = admin;
  
} else {
  console.log("Firebase Already initialized");
}

//require('../api/routes/upload')(app);
async function loadExpress() {
  await require("./express");
}

console.log("Loading DB.....");
// app.use('/uploads', express.static('uploads'));
//app.use(express.static("uploads"))
require("./mongoose");

console.log("Loading Express....");

loadExpress();

