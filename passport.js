const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//***''LocalStrategy''defines the basic HTTP authentication for login requests. ''LocalStrategy'' takes a username and password from the request body and uses Mongoose to check the database for a user with the same username.
passport.use(new LocalStrategy(
    {
        usernameField: 'Username',
        passwordField: 'Password'
    },
    (username, password, callback) => {
        console.log(username + '  ' + password);
        Users.findOne({ Username: username })
            .then((user) => {
                //***Action if something is wrong with the information sent by the user in his login request.
                if (!user) {
                    console.log("incorrect username");
                    return callback(null, false, {
                        message: "Incorrect username.",
                    });
                }
                //***Action if something is wrong with the information sent by the user in his login request.
                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, { message: 'Incorrect password.' });
                }
                //***If there’s a match with the information sent by the user to login with the info in the database, the callback function will be executed.
                console.log("finished");
                return callback(null, user);
            })
            //***Action if something is wrong with the information sent by the user in his login request.
            .catch((e) => {
                console.error(e);
                return callback(error);
            });
    }
)
);

//***''JWTStrategy'' allows you to authenticate users based on the JWT submitted alongside their request. In the code above, the JWT is extracted from the header of the HTTP request (this JWT is called the ''bearer token'').
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //***The secret key is used to verify the signature of the JWT. This signature verifies that the sender of the JWT (user) is who it says it is and also that the JWT hasn’t been altered.
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