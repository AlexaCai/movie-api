/**
 * @fileoverview auth.js
 * @description This file contains the API logic for user login, including authentication using Passport and emission of JWT tokens upon users successful login. It has one POST endpoint : /login.
*/

const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
  passport = require('passport');
require('./passport');


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    //***This is the algorithm used to “sign” or encode the values of the JWT.
    algorithm: 'HS256'
  });
}


/**
 * @function
 * @name userLogin
 *
 * @Summary 
 * Allow to LOGIN into their account. This endpoint allows to login, receive their necessary token (JWT) to make other endpoints calls and navigate in the app.
 * 
 * POST user login endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /login <br>
 *-Query parameter(s) (parameter(s) in the URL): none <br>
 *-HTTP method: POST <br>
 *-Request body data format: JSON object holding data about the user who wants to log in. <br>
 * @example SENT JSON object.
 *   {
 *     "Username": "", 
 *     "Password": ""
 *   }
 * @return JSON object holding data about the user's just logged in.
 * @example RESPONSE/RETURNED JSON object.
 *   {
 *     "Username": "", 
 *     "Password": "", 
 *     "Email": "", 
 *     "Birthday": "", 
 *     "FavoriteMovies": [], 
 *     "_id": "", 
 *     "__v": 0
 *   }
 */
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