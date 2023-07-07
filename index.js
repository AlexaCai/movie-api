// ***Used to import Express module.
const express = require('express');
// ***Used to declare a variable that encapsulates Express’s functionality to configure the web server. This new variable is what will be use to route HTTP requests and responses.
const app = express();

//***Used to import CORs module (). This code specifies that the app (defined upper by const ''app = express();'') uses CORS. CORs allows to control which domains have access to the API’s server (and so, to keep it protected from malicious entities). 
const cors = require('cors');
//***Code below, related to CORs, makes sure only certain origins are given access to the app. ''let allowedOrigins = [abc, def] creates a list of allowed domains, then compares the domains of any incoming request with this list and either allows it (if the domain is on the list) or returns an error (if the domain isn’t on the list). The * in ''let allowedOrigins = ['*'];'' means that all domains are allowed to make requests to the API.
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

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

// ***Used to import Body-parser module.
const bodyParser = require('body-parser')
// Used as the application of the body-parser as middleware into the app.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//***Used to import the ''auth.js'' file with the code content for authenticaion of users when they are loging in.
//***(app); ensures that Express is available in the ''auth.js'' file as well.
let auth = require('./auth')(app);

//***Used to import Passport module (Passport is an authentication middleware for Node.js and Express).
const passport = require('passport');
//***Used to import the ''passport.js'' file (which contains code for users logging authentication).
require('./passport');

// ***Used to import Uuid module.
const uuid = require('uuid');

//***Used to import Express-validator module (JavaScript libraries used to add validation -to protect against some attacks- to a Node.js/Express application.
const { check, validationResult } = require('express-validator');

// ***Used to import Morgan (preexisting library as a logging middleware, equipped to log any and all useful information about a request).
const morgan = require('morgan');
// ***The ''common'' parameter specifies that requests should be logged using Morgan’s ''common'' format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response. 
app.use(morgan('common'));

// ***Used to import the Mongoose module and the ''models.js'' file.
const mongoose = require('mongoose');
const Models = require('./models.js');

// ***These lines require the Mongoose models defined in the ''models.js'' file, so they can be used in this file. ''Models.Movie'' and ''Models.User'' refer to the model names defined in the ''models.js'' file. Once the models are imported into ''index.js'' file, the API endpoints can make use of them in order to query the MongoDB database according to the schemas defined in ''models.js''.
const Movies = Models.Movie;
const Users = Models.User;

//***Code below allows Mongoose to connect to the database (see /cfDB in the path) so it can perform CRUD operations on the documents it contains from within the REST API (locally on the computer localhost).
// mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
//***Since the database is located online, the mongoose.connect command upper needs to be changed and be directed, instead, to the new MongoDB Atlas database (command line below). However if this new ''mongoose.connect'' is pushed to GitHub, the connection URI will be exposed to whoever views the repository (this means that anyone could use the database and manipulate the data there because all the necessary credentials are included in the connection URI below (ex: password). To avoid this problem, the environment variables are needed.
// mongoose.connect('mongodb+srv://movieAPIadmin:(password-used)@cluster1-movie-api.esafywf.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
//***Connection link with environment variable. With the ''mongoose.connect'' below, the connection URI will never be exposed in the ''index.js'' file pushed on Github (more secure as some information such as the password dont appear).
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// ***REQUEST: Return a list of all movies.
// ***READ (with MONGOOSE) : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies' and returns a JSON object containing data about the movies list, allowing the user to GET/READ the info.
//***passport.authenticate('jwt', { session: false }), is a parameter of the GET request that makes sure any request to the ''/movies'' endpoint will require a JWT from the client. The JWT will be decoded and checked by the JWT authentication strategy created earlier using Passport, which will authenticate the request.
app.get('/movies', (req, res) => {
    //***The .find() function in Mongoose grabs data in the database of all the movies, since no specific movie was specified in the request.
    Movies.find()
    .lean()
        //***After the document is created, a response is sent back to the client with the movies data (document) that was just read/requested. The parameter for this callback, which is named ''movies'' here refers, by default, to the documents (each movie = one document) that were just read.
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
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// ***REQUEST: Return data about a single movie by title .
// ***READ (WITH MONGOOSE) : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/:title' and returns a JSON object containing data about the movies requested, allowing the user to GET/READ the info.
app.get('/movies/:Title', (req, res) => {
    //***The .findOne({ Title: req.params.Title }) function in Mongoose grabs data in the database on the specified Title from the request. 
    Movies.findOne({ Title: req.params.Title })
    .lean()
        //***After the document is created, a response is sent back to the client with the movie data (document) that was just read/requested. The parameter for this callback, which is named ''movie'' here refers, by default, to the document that was just read.
        .then((movie) => {
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
            res.json(movie);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// ***REQUEST: Return data about a genre by name.
// ***READ (with MONGOOSE): The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/genres/genreName' and returns a JSON object containing data about the genre requested, allowing the user to GET/READ the info.
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    //***The .findOne({ 'Genre.Name': req.params.genreName }) function in Mongoose grabs data in the database on the specified Genre from the request. 
    Movies.find({ 'Genre.Name': req.params.genreName })
        //***After the document is created, a response is sent back to the client with the Genre data that was just read/requested. The parameter for this callback, which is named ''genre'' here refers, by default, to the document that was just read.
        .then((genre) => {
            res.json(genre);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// ***REQUEST: Return data about a director by name.
// ***READ (with MONGOOSE): The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/directors/:directorName' and returns a JSON object containing data about the director requested, allowing the user to GET/READ the info.
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    //***The .findOne({ 'Director.Name': req.params.directorName }) function in Mongoose grabs data in the database on the specified Director from the request. 
    Movies.find({ 'Director.Name': req.params.directorName })
        //***After the document is created, a response is sent back to the client with the director data that was just read/requested. The parameter for this callback, which is named ''director'' here refers, by default, to the document that was just read.
        .then((director) => {
            res.json(director);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//***REQUEST: Allow new users to register.
//***POST (WITH MONGOOSE): The request is equal to the 'CREATE' in the CRUD functions for systems that store data. Therefore, Express POST the data sent by the user at the endpoint '/users' and returns a JSON object containing data about the account created.
app.post('/users',
    ///***Validation logic here for request. Dictate what is accepted or not when users create an account for important fields: username, password, and email. The validation code first ensures that the fields actually contain something (as each field is required); then, it checks that the data within follows the correct format (ex: username min lenght of 5 characters).
    [
        check('Username', 'Username with min. 5 characters is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        //***Check the validation object for errors. If an error occurs, the rest of the code will not execute, keeping the database safe from any potentially malicious code. In addition, the user is notified of the error, which will allow them to fix it and resubmit their data if it was a harmless mistake.
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //***Used to hash any password entered by the user when registering before storing it in the MongoDB database.
        let hashedPassword = Users.hashPassword(req.body.Password);
        //***.findOne({ Username: req.body.Username }) first check if a user with the name provided by the new user already exists.
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    //***If the given name does exist, the app send back the appropriate response to the client (name thats trying to be create already exists).
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    //***If the given name doesn’t exist, the Mongoose’s create command is used to CREATE the new user.
                    Users
                        //***The create command takes an object, where each key in the object corresponds to a certain field specified in the schema (from the 'models.js' file for the ''User'' model) and each value is set to a value that is received from the request body (via req.body) sent by the client.
                        //***The use of req.body.Username (or req.body.Password or else) allows to collect all of the information from the HTTP request body sent by the client, use Mongoose to populate the user document inside the ''Users'' collection, then add it to the database.
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        //***After the document is created, a callback takes the document just added as a parameter (here, this new document is given the name ''user'').
                        //***Within this callback, a response is sent back to the client that contains both a status code and the document (called ''user'') that has been just created (res.status(201).json(newUser)). This gives the client feedback on his request, letting them know that it’s been completed.
                        .then((user) => { res.status(201).json(user) })
                        //***Error-handling function at the end to catch any errors that may occur.
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });


//***REQUEST: Allow users to update their user info.
//***PUT (with MONGOOSE): The request is equal to the 'UPDATE' in the CRUD functions for systems that store data. Therefore, Express UPDATE the information of a user located at the endpoint '/users/:Userame' and returns a JSON object containing data about the user (updated version).
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
    //***Validation logic here for update requests. Dictate what is accepted or not when users try to update an account for important fields: username, password, and email. The validation code first ensures that the fields actually contain something (as each field is required); then, it checks that the data within follows the correct format (ex: username min lenght of 5 characters).
    [
        check('Username', 'Username with min. 5 characters is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        //***Check the validation object for errors. If an error occurs, the rest of the code will not execute, keeping the database safe from any potentially malicious code. In addition, the client is notified of the error, which will allow them to fix it and resubmit their data if it was a harmless mistake.
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //***Used to hash any password entered by the user when updating before storing it in the MongoDB database.
        let hashedPassword = Users.hashPassword(req.body.Password);
        //***.findOneAndUpdate({ Username: req.params.Username }) searches for the user that wish to be updated in the database, via its name, and update it based on the info sent on his request.
        Users.findOneAndUpdate({ Username: req.params.Username },
            {
                //***$set is used to specifed which fields in the user document is to be update. The new values that are set on each of these specific fields are extracted from the request body sent by the client.
                $set:
                {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }
            },
            //***{ new: true } specifies that in the proceeding callback, the document that was just updated is the one to be returned.
            { new: true }
        )
            //***Answer to the client if the update worked ('updatedUser' being the newly updated data/document of the user).
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            //***Error-handling function at the end to catch any errors that may occur.
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
    });


// // ***REQUEST: Allow users to add a movie to their list of favorites.
// // ***POST (with MONGOOSE) : The request is equal to the 'CREATE' in the CRUD functions for systems that store data (but could also have been an UPDATE). Therefore, Express POST the data sent by the user at the endpoint '/users/:Username/movies/:MovieID' and returns a confirmation message.
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    //***.findOneAndUpdate({ Username: req.params.USername }) searches for the user that wish to update his favorite movies in the database, via its name, and update his favorite movies based on the info sent on his request.
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }
    )
        //***Answer to the client if the update worked ('updatedUserMovie' being the newly updated data/document of the user).
        .then((updatedUserMovie) => {
            res.json(updatedUserMovie);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});


//***REQUEST: Allow users to remove a movie from their list of favorites.
//***DELETE (with MONGOOSE) : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:USername/movies/:MovieID' and returns a JSON object containing data about the account for which the movie has been deleted.
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    //***.findOneAndUpdate({ Username: req.params.Name }) searches for the user that wish to update his favorite movies in the database, via its name, and update his favorite movies based on the info sent on his request.
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        //***Code exactly the same as when a user add a favorite movie, only this time the ''$pull'' operator is used instead of the ''$push'' operator, and the app.post is modified to app.delete.
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }
    )
        //***Answer to the client if the update worked ('updatedUserMovie' being the newly updated data/document of the user).
        .then((updatedUserMovie) => {
            res.json(updatedUserMovie);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});


// ***REQUEST: Allow existing users to deregister.
// ***DELETE (with MONGOOSE) : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:Username' and returns a message.
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


// ***Express GET route located at the endpoint '/' returns a string default message. It's the root directory.
app.get('/', (req, res) => {
    res.send('Welcome to your new movie e-friend advisor!');
});


// ***app.use(express.static('public')); is used to serve the ''documentation.html'' file from the public folder.
// ***This function automatically routes all requests for static files to their corresponding files within a certain folder on the server (in this case, the '"public"' folder inside the parent folder ''movie_api''). 
// ***With this function in place, if someone requests the ''documentation.html'' file, Express would automatically route that request to send back a response with the ''public/documentation.html'' file.
app.use(express.static('public'));


// ***This code would execute every time an error occurs in the code. Information about the current error would be logged to the terminal using err.stack, which is a property of the error parameter for the middleware function. 
// ***Error-handling middleware should always be defined last in a chain of middleware, after all other instances of app.use() and route calls (after app.get(), app.post(), etc.) but before app.listen().
// ***The first of parameters ('err') allows to receive information about whatever unexpected error brought to the current handler.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


//***Used to set up the server to listen to for requests on port 8080 (to local/internal computer).
// app.listen(8080, () => { console.log('Your app is listening on port 8080.'); });
//***Since external poeple will be using the app however, it's necessary to allow the port to change if necessary. This is done by ''process.env.PORT'', which looks for a pre-configured port number in the environment variable, and, if nothing is found, sets the port to a certain port number.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});