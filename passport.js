//***Passport is an authentication middleware for Node.js and Express. 
//***In this code, two Passport strategies are defined.
const passport = require('passport'),
//***LocalStrategy defines the basic HTTP authentication for login requests. LocalStrategy takes a username and password from the request body and uses Mongoose to check your database for a user with the same username.
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
//***JWTStrategy allows to authenticate users based on the JWT submitted alongside their request. The JWT is extracted from the header of the HTTP request. This JWT is called the ''bearer token''.
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));

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