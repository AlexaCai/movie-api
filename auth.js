//***This endpoint could technically be alongside with the other endpoints (in the index.js file), but since we implement a special authentication measures for this request, this endpoint is added in a separate file here (auth.js).
//***This has to be the same key use in the JWTStrategy in de passport.js file.
const jwtSecret = 'your_jwt_secret'; 

const jwt = require('jsonwebtoken'),
  passport = require('passport');

//***Rquire the local passport.js file.
require('./passport');


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    //***Name enconding in the JWT
    subject: user.Username, 
    //***Specify that the token will expire in 7 days
    expiresIn: '7d', 
    //***Algorithm used to ''sign'' or encode the values of the JWT
    algorithm: 'HS256' 
  });
}


//***POST login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}