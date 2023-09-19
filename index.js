const express = require('express');
const app = express();


const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myflix-movies-advisor.netlify.app'];
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


//***REQUEST: Return a list of all movies - READ (with MONGOOSE).
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


//***REQUEST: Return data about a single movie by title - READ (WITH MONGOOSE).
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


//***REQUEST: Return data about a genre by name - READ (with MONGOOSE).
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


//***REQUEST: Return data about a director by name - READ (with MONGOOSE).
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


//***REQUEST: Allow new users to register - POST (WITH MONGOOSE).
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


//***REQUEST: Allow users to update their user info - PUT (with MONGOOSE).
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

//***REQUEST: Allow to get information on the user logged-in - GET (with MONGOOSE).
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .lean()
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//***REQUEST: Allow users to add a movie to their list of favorites - POST (with MONGOOSE).
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


//***REQUEST: Allow users to remove a movie from their list of favorites - DELETE (with MONGOOSE).
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


//***REQUEST: Allow existing users to deregister - DELETE (with MONGOOSE).
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


//***Express GET route located at the endpoint '/' returns a string default message. It's the root directory.
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