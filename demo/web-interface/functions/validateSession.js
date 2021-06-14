const webRequest = require('request');

module.exports.checkSession = async function (app, sessionVal, JWTToken) {
    return await checkSession(app, sessionVal, JWTToken);
}

const checkSession = async function (app, sessionVal, jwtToken) {
    return new Promise(async function (resolve, reject) {
        await webRequest.get({
                headers: {
                    'Connection': 'close',
                    'Content-Type': 'application/json',
                    'Token': sessionVal
                },
                url: 'https://magnus.cjax.uk/test'
            }, await
            function (error, response, body) {
                if (response.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
    });
}