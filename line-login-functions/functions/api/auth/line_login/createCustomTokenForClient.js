'use strict';

// API code
exports.handler = ((req, res) => {
    req.checkBody('line_access_token').notEmpty();

    const lineAccessToken = req.body.line_access_token;

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
