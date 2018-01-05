'use strict';

// Modules imports
const functions = require('firebase-functions');
const rp = require('request-promise');

// Firebase Setup
const admin = require('firebase-admin');
const serviceAccount = functions.config().service_account;
if (!serviceAccount) {
    throw new Error('please set SERVICE ACCOUNT before you deploy!');
} // you can remove this if statement after you set.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const bodyParser = require('body-parser');
const express = require('express');
const expressValidator = require("express-validator");
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});

const app = express();

app.use(bodyParser.json());
app.use(expressValidator([])); // this line must be immediately after any of the bodyParser middlewares!

app.use(cors);
app.use(cookieParser);

app.post('/auth/line_login/client/custom_token', require('./api/auth/line_login/createCustomTokenForClient').handler);
app.post('/auth/line_login/web/custom_token', require('./api/auth/line_login/createCustomTokenForWeb').handler);

// Expose the API as a function
exports.api = functions.https.onRequest(app);
