'use strict';
const functions = require('firebase-functions');
const rp = require('request-promise');

// Line Setup
if (!functions.config().line ||
    !functions.config().line.login ||
    !functions.config().line.login.channel_id ||
    !functions.config().line.login.client_secret) {
    throw new Error('please set LINE login CHANNEL_ID & CLIENT_SECRET before you deploy!');
}

const line_login_channel_id = functions.config().line.login.channel_id;
const line_login_client_secret = functions.config().line.login.client_secret;

// API code
exports.handler = ((req, res) => {
    req.checkBody('code').notEmpty();
    req.checkBody('redirect_uri').notEmpty();

    const code = req.body.code;
    const redirect_uri = req.body.redirect_uri;

    req.getValidationResult().then(result => {
        console.info('validating requested data.');

        if (!result.isEmpty()) {
            return res.status(400).json({
                error: result.array()
            });
        }
    }).then((error) => {
        if (error) {
            console.error(error);
            throw new Error('validating request Error');
        }
        console.info('validated. (result OK)');
        return Promise.resolve();

    }).then(() => {
        const options = {
            method: 'POST',
            uri: 'https://api.line.me/oauth2/v2.1/token',
            json: true,
            timeout: 10 * 1000,
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                client_id: line_login_channel_id,
                client_secret: line_login_client_secret,
            },
        };
        return rp(options);

    }).then((response) => {
        console.log('requested token from code successfully.');
        return Promise.resolve(response);

    }).then((response) => {
        const lineAccessToken = response.access_token;

        const line_login_util = require('./lineLoginUtil');
        return line_login_util.createFirebaseCustomToken(lineAccessToken);

    }).then((firebaseCustomToken) => {
        const result = {
            firebase_token: firebaseCustomToken,
        };
        return res.status(200).json(result);

    }).catch(error => {
        console.error('Error: ', error);
        return res.status(500).json({error: error});
    });
});
