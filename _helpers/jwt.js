const expressJwt = require('express-jwt');
const config = require('config.json');
const control = require('../users/user.controller')
module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await control.getByIdForJWT(payload.currentId);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    done();
};