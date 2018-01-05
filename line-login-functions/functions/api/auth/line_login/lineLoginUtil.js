'use strict';
const admin = require('firebase-admin');
const rp = require('request-promise');

exports.createFirebaseCustomToken = function (lineAccessToken) {
    let firebaseUid;

    return Promise.resolve().then(() => {
        const options = {
            method: 'GET',
            url: 'https://api.line.me/v2/profile',
            json: true,
            timeout: 10 * 1000,
            headers: {
                'Authorization': `Bearer ${lineAccessToken}`,
            },
        };
        return rp(options);

    }).then((response) => {
        console.log('requested profile successfully.');
        return Promise.resolve(response);

    }).then((response) => {
        if (!response.userId) {
            return Promise.reject('No userId.');
        }

        firebaseUid = 'line:' + response.userId;
        return admin.auth().getUser(firebaseUid).then(() => {
            console.log(`user ${firebaseUid} was found.`);
        }).catch((error) => {
            if (error.code === 'auth/user-not-found') {
                const createRequest = {
                    uid: firebaseUid,
                };
                if (response.displayName) createRequest.displayName = response.displayName;
                if (response.pictureUrl) createRequest.pictureUrl = response.pictureUrl;

                return admin.auth().createUser(createRequest).then(() => {
                    console.log('created user successfully.');
                    return Promise.resolve();
                });
            } else {
                return Promise.reject(error);
            }
        });

    }).then(() => {
        const claims = {
            provider: 'LINE',
        };

        return admin.auth().setCustomUserClaims(firebaseUid, claims);

    }).then(() => {
        console.log('set custom user claims successfully.');
        return Promise.resolve();

    }).then(() => {
        return admin.auth().createCustomToken(firebaseUid);

    }).then((firebaseCustomToken) => {
        console.log('created custom token successfully.');
        return Promise.resolve(firebaseCustomToken);

    });
};
