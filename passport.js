/**
 * @fileoverview passport.js
 * @description This file contains the logic that handles two authentication strategies: local (username and password) and JWT. These strategies are then used by different API endpoints in index.js to allow or restrict certain data resources.
*/

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');


let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy(
    {
        usernameField: 'Username',
        passwordField: 'Password'
    },
    (username, password, callback) => {
        console.log(username + '  ' + password);
        Users.findOne({ Username: username })
            .then((user) => {
                if (!user) {
                    console.log("incorrect username");
                    return callback(null, false, {
                        message: "Incorrect username.",
                    });
                }
                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, { message: 'Incorrect password.' });
                }
                console.log("finished");
                return callback(null, user);
            })
            .catch((e) => {
                console.error(e);
                return callback(error);
            });
        }
    )
);


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));