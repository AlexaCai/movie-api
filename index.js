/**
 * @fileoverview index.js
 * @description This file constitutes the main API element. All endpoints are defined there, as well as their specific parameters, what they require and what information they return. Endpoints summary (12 in total) :
*<pre>
*-6 GET
*-1 PUT
*-3 POST
*-2 DELETE
*<pre>
*This file also contains the codes to import other project files (eg: auth.js which contains the logic for log in or passport.js which contains the logic related to JWT)
*as well as codes that configure certain additional elements, such as cross-origin resource sharing (CORS).
*/

const express = require('express');
const app = express();

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'http://localhost:4200', 'https://myflix-movies-advisor.netlify.app', 'https://alexacai.github.io/'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));


const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let auth = require('./auth')(app);


const passport = require('passport');
require('./passport');


const uuid = require('uuid');


const { check, validationResult } = require('express-validator');


const morgan = require('morgan');
app.use(morgan('common'));


const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


/**
 * @function
 * @name getMovies
 *
 * @Summary 
 * Get a list of all movies. This endpoint allows to retrieve a list of all movies from the MongoDB database and returns them as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and access the movies.<br><br>
 * 
 * GET movies endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /movies <br>
 *-Query parameter(s) (parameter(s) in the URL): none <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the movies from the database.
 * @example RESPONSE/RETURNED JSON object.
 * [
 *   {
 *     "Title": "",
 *     "Description": "",
 *     "Genre": {
 *       "Name": "",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "",
 *       "Bio": "",
 *       "Birth": "",
 *       "Death": "",
 *     },
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *   }
 * ]
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .lean()
        .then((movies) => {
            movies.forEach((movie) => {
                if (movie.Director && movie.Director.Birth) {
                    const directorBirth = new Date(movie.Director.Birth);
                    const formattedBirthDate = directorBirth.toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    movie.Director.Birth = formattedBirthDate;
                }
            });
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * @function
 * @name getOneMovie
 *
 * @Summary 
 * Get one specific movie. This endpoint allows to retrieve a specific movie from the MongoDB database based on title, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and access the movie.<br><br>
 * 
 * GET one movie endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /movies/:Title <br>
 *-Query parameter(s) (parameter(s) in the URL): :Title <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the movie requested from the database.
 * @example RESPONSE/RETURNED JSON object.
 *   {
 *     "Title": "(REQUESTED MOVIE)",
 *     "Description": "",
 *     "Genre": {
 *       "Name": "",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "",
 *       "Bio": "",
 *       "Birth": "",
 *       "Death": "",
 *     },
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *   }
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .lean()
        .then((movie) => {
            if (movie && movie.Director && movie.Director.Birth) {
                const directorBirth = new Date(movie.Director.Birth);
                const formattedBirthDate = directorBirth.toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                });
                movie.Director.Birth = formattedBirthDate;
            }
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * @function
 * @name getGenre
 *
 * @Summary 
 * Get one specific movie genre. This endpoint allows to retrieve a specific movie genre from the MongoDB database based on genre name, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and access a genre information.<br><br>
 * 
 * GET a genre endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /movies/genre/:genreName <br>
 *-Query parameter(s) (parameter(s) in the URL): :genreName <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the genre requested from the database.
 * @example RESPONSE/RETURNED JSON object.
 *   {
 *     "Title": "",
 *     "Description": "",
 *     "Genre": {
 *       "Name": "REQUESTED GENRE",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "",
 *       "Bio": "",
 *       "Birth": "",
 *       "Death": "",
 *     },
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *   }
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName })
        .lean()
        .then((genre) => {
            genre.forEach((movie) => {
                if (movie.Director && movie.Director.Birth) {
                    const directorBirth = new Date(movie.Director.Birth);
                    const formattedBirthDate = directorBirth.toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    movie.Director.Birth = formattedBirthDate;
                }
            });
            res.json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * @function
 * @name getDirector
 *
 * @Summary 
 * Get one specific movie director. This endpoint allows to retrieve a specific movie director from the MongoDB database based on the director name, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and access a director information.<br><br>
 * 
 * GET a director endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /movies/directors/:directorName <br>
 *-Query parameter(s) (parameter(s) in the URL): :directorName <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the director requested from the database.
 * @example RESPONSE/RETURNED JSON object.
 *   {
 *     "Title": "",
 *     "Description": "",
 *     "Genre": {
 *       "Name": "",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "REQUESTED DIRECTOR ",
 *       "Bio": "",
 *       "Birth": "",
 *       "Death": "",
 *     },
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *   }
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ 'Director.Name': req.params.directorName })
        .lean()
        .then((director) => {
            director.forEach((movie) => {
                if (movie.Director && movie.Director.Birth) {
                    const directorBirth = new Date(movie.Director.Birth);
                    const formattedBirthDate = directorBirth.toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    movie.Director.Birth = formattedBirthDate;
                }
            });
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * @function
 * @name createUser
 *
 * @Summary 
 * Allow new users to register/create an account. This endpoint sends the new users' information to the MongoDB database, and returns it as a JSON response. <br><br>
 * 
 * POST new users information endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users <br>
 *-Query parameter(s) (parameter(s) in the URL): none <br>
 *-HTTP method: POST <br>
 *-Request body data format: JSON object holding data about the user who wants to create an account. <br>
 * @example SENT JSON object.
 *   {
 *     "Username": "", 
 *     "Password": "", 
 *     "Email": "", 
 *     "Birthday": "", 
 *     "FavoriteMovies": [], 
 *     "_id": "", 
 *     "__v": 0
 *   }
 * @return JSON object holding data about the user's new account just created.
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
app.post('/users',
    [
        check('Username', 'Username with min. 5 characters is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(409).send(req.body.Username + ' already exists, please choose another username.');
                } else {
                    Users.findOne({ Email: req.body.Email })
                        .then((existingEmailUser) => {
                            if (existingEmailUser) {
                                const errorMessage = req.body.Email + ' already exists, please choose another email.';
                                return res.status(409).send(errorMessage);
                            } else {
                                let hashedPassword = Users.hashPassword(req.body.Password);
                                Users
                                    .create({
                                        Username: req.body.Username,
                                        Password: hashedPassword,
                                        Email: req.body.Email,
                                        Birthday: req.body.Birthday
                                    })
                                    .then((user) => { res.status(201).json(user) })
                                    .catch((err) => {
                                        console.error(err);
                                        res.status(500).send('Error: ' + err);
                                    });
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send('Error: ' + err);
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });


/**
 * @function
 * @name updateUser
 *
 * @Summary 
 * Allow users to update their information/account. This endpoint sends users updated information to the MongoDB database, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and update information.<br><br>
 * 
 * PUT users update information endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users/:Username <br>
 *-Query parameter(s) (parameter(s) in the URL): :Username <br>
 *-HTTP method: PUT <br>
 *-Request body data format: JSON object holding data the user wants to update. <br>
 * @example SENT JSON object.
 *   {
 *     "Username": "", 
 *     "Password": "", 
 *     "Email": "", 
 *     "Birthday": ""
 *   }
 * @return JSON object holding data about the user's updated account.
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
    [
        check('Username', 'Username with min. 5 characters is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        Users.findOne({ Username: req.body.Username, _id: { $ne: req.user._id } })
            .then((existingUsernameUser) => {
                if (existingUsernameUser) {
                    return res.status(409).send(req.body.Username + ' already exists, please choose another username.');
                } else {
                    Users.findOne({ Email: req.body.Email, _id: { $ne: req.user._id } })
                        .then((existingEmailUser) => {
                            if (existingEmailUser) {
                                const errorMessage = req.body.Email + ' already exists, please choose another email.';
                                return res.status(409).send(errorMessage);
                            } else {
                                let hashedPassword = Users.hashPassword(req.body.Password);
                                Users.findOneAndUpdate(
                                    { Username: req.params.Username },
                                    {
                                        $set: {
                                            Username: req.body.Username,
                                            Password: hashedPassword,
                                            Email: req.body.Email,
                                            Birthday: req.body.Birthday,
                                        },
                                    },
                                    { new: true }
                                )
                                    .then((updatedUser) => {
                                        res.json(updatedUser);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        res.status(500).send('Error: ' + err);
                                    });
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send('Error: ' + err);
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });


/**
 * @function
 * @name getUserInfo
 *
 * @Summary 
 * Allow to GET information about a current logged in user. This endpoint allows to retrieve a specific user information from the MongoDB database based on the user's username, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and get the user's information.<br><br>
 * 
 * GET user information endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users/:Username <br>
 *-Query parameter(s) (parameter(s) in the URL): :Username <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the user.
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
app.get('/users/:Username', passport.authenticate("jwt", { session: false }), (req, res) => {
    const username = req.params.Username;
      Users.findOne({ Username: username })
      .lean()
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
          res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


/**
 * @function
 * @name addFavoriteMovies
 *
 * @Summary 
 * Allow to POST favorite movies into user account. This endpoint allows to add favorite movies to a user list of favorite in the MongoDB database based on the user's username and movie ID, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and add a favorite movie to a user list of favorite.<br><br>
 * 
 * POST new favorite movies endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users/:Username/ movies/:movieID <br>
 *-Query parameter(s) (parameter(s) in the URL): :Username & :movieID <br>
 *-HTTP method: POST <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the user and the new movie added.
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }
    )
        .then((updatedUserMovie) => {
            res.json(updatedUserMovie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});


/**
 * @function
 * @name deleteFavoriteMovies
 *
 * @Summary 
 * Allow to DELETE favorite movies from user's account. This endpoint allows to remove favorite movies from a user list of favorite in the MongoDB database based on the user's username and movie ID, and returns it as a JSON response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and remove a favorite movie from a user list of favorite.<br><br>
 * 
 * DELETE favorite movies endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users/:Username/ movies/:movieID <br>
 *-Query parameter(s) (parameter(s) in the URL): :Username & :movieID <br>
 *-HTTP method: DELETE <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return JSON object holding data about the user (the movie removed not appearing anymore).
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }
    )
        .then((updatedUserMovie) => {
            res.json(updatedUserMovie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});



/**
 * @function
 * @name deleteUser
 *
 * @Summary 
 * Allow to DELETE a user account. This endpoint allows to delete a specific user account from the MongoDB database based on the user's username, and returns it as a message response.
 * Authentication using JWT (received by users upon successful login) is required to use this route and delete user's account. <br><br>
 * 
 * DELETE user account endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: /users/:Username <br>
 *-Query parameter(s) (parameter(s) in the URL): :Username <br>
 *-HTTP method: DELETE <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return Confirmation message that the account has been deleted.
 * @example RESPONSE/RETURNED message: '(userame) has been deleted.'
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * @function
 * @name rootDirectory
 *
 * @Summary 
 * This endpoint is the root directory. <br><br>
 * 
 * GET root endpoint characteristics: <br><br>
 * 
 *-Endpoint URL: / <br>
 *-Query parameter(s) (parameter(s) in the URL): none <br>
 *-HTTP method: GET <br>
 *-Request body data format: N.A. <br>
 *-Request body data example: N.A. <br>
 * @return Message.
 * @example RESPONSE/RETURNED message: 'Welcome to your new movie e-friend advisor!'
 */
app.get('/', (req, res) => {
    res.send('Welcome to your new movie e-friend advisor!');
});


//***app.use(express.static('public')); is used to serve the ''documentation.html'' file from the public folder.
app.use(express.static('public'));


//***This code would execute every time an error occurs in the code. Information about the current error would be logged to the terminal using err.stack. 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


//***Since external poeple will be using the app, need to allow the port to change if necessary. This is done by ''process.env.PORT'', which looks for a pre-configured port number in the environment variable, and, if nothing is found, the port is sets to a certain port number.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});