// ***Used to import Express module.
const express = require('express');
// ***Used to import Body-parser module.
const bodyParser = require('body-parser')
// ***Used to import Uuid module.
const uuid = require('uuid');
// ***Used to import Morgan (preexisting library as a logging middleware, equipped to log any and all useful information about a request)
const morgan = require('morgan');


// ***Used to declare a variable that encapsulates Express’s functionality to configure the web server. This new variable is what will be use to route HTTP requests and responses.
const app = express();
// Used as the application of the body-parser as middleware into the app.
app.use(bodyParser.json());
// ***The 'common' parameter in app.use(morgan('common')); below specifies that requests should be logged using Morgan’s 'common' format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response. When running code with app.use(morgan('common')); this code will returns parts of the “common” format console logging into the terminal (such as date and time of request, the method such as GET, URL path, response code and number of characters of the response that was sent back).
app.use(morgan('common'));


// ***App users
let users = [
    {
        id: 1,
        name: 'Jack Bill',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Ben Cohen',
        favoriteMovies: ['Harry Potter']
    },
    {
        id: 3,
        name: 'Naty Meyers',
        favoriteMovies: ['Peter Pan']
    },
];

// ***Top movies list
let movies = [
    {
        Title: 'Harry Potter and the Philosopher\'s Stone',
        DOMExceptionescription: '',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is the best'
        },
        Director: {
            Name: 'Chris Columbus',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Jurassic Park',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Steven Spielberg',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Kon-Tiki',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Joachim Rønning and Espen Sandberg',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'The godfather',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Francis Ford Coppola',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Coach Carter',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Thomas Carter',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Gladiator',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Ridley Scott',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'The pirates of Somalia',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Bryan Buckley',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Hotel Rwanda',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Terry George',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Blood diamond',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Edward Zwick',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Ratatouille',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Brad Bird',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
    {
        Title: 'Princess Mononoke',
        DOMExceptionescription: '',
        Genre: {
            Name: '',
            Description: ''
        },
        Director: {
            Name: 'Hayao Miyazaki',
            Bio: '',
            Birth: ''
        },
        ImageURL: '',
    },
];


// ***REQUEST: Return a list of all movies to the user.
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies' and returns a JSON object containing data about the movies list (data inside the variable movies upper), allowing the user to GET/READ the info.
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


// ***REQUEST: Return data - title, description, genre, director, image URL) about a single movie by title to the user.
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/:title' and returns a JSON object containing data about the movies requested, allowing the user to GET/READ the info.
app.get('/movies/:title', (req, res) => {
    // ***Creation of a new variable that is equal to req.params.title, which in turn is equal to whatever value/title the user passes through the URL and use that accordingly. So in that case 'const title' will equal whatever title the user is looking for and has been placed in the URL. Note that 'const title = req.params.title;' is not used because 'const { title } = req.params;' used below does the exact same thing - it's just written differently.
    // const title = req.params.title;

    // ***Creation of a new variable title and that title variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { title } = req.params;
    // ***When 'movie.Title === title' ('movie.Title' being a movie title from the array list inside the 'movies' variable upper, and 'title' being the title searched by the user), send the current value of 'movie =>' out to the 'const movie' variable.
    const movie = movies.find(movie => movie.Title === title);

    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie')
    }
});


// ***REQUEST: Return data about a genre (description) by name (e.g., “Thriller”).
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/genres/genreName' and returns a JSON object containing data about the genre requested, allowing the user to GET/READ the info.
app.get('/movies/genre/:genreName', (req, res) => {

    // ***Creation of a new variable genreName, and that genreName variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { genreName } = req.params;
    // ***movies.find(movie => movie.Genre.Name === genreName).Genre; returns the value for the 'Genre' searched and present inside the array list in the movies variable upper. The '.Genre' at the end is important because that's what make it possible to returns the specific propertie of a searched 'Genre' from the array list movies. Otherwise, this method would returns the value of the entire object of a movie containing the searched genre.
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre')
    }
});


// ***REQUEST: Return data about a director (bio, birth year, death year) by name.
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/directors/:directorName' and returns a JSON object containing data about the director requested, allowing the user to GET/READ the info.
app.get('/movies/directors/:directorName', (req, res) => {

    // ***Creation of a new variable directorName, and that directorName variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { directorName } = req.params;
    // ***movies.find(movie => movie.Director.Name === directorName).Director; returns the value for the 'Director' searched and present inside the array list in the movies variable upper. The '.Director' at the end is important because that's what make it possible to returns the specific propertie of a searched 'Director' from the array list movies. Otherwise, this method would returns the value of the entire object of a movie containing the searched director.
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director')
    }
});


// ***REQUEST: Allow new users to register.
// ***POST : The request is equal to the 'CREATE' in the CRUD functions for systems that store data. Therefore, Express POST the data sent by the user at the endpoint '/users' and returns a JSON object containing data about the account created.
app.post('/users', (req, res) => {
    // ***Creation of a new variable newUser, and that newUser variable is equal to the request body data format (a JSON object holding data about the account to create) sent by the user who wishes to create an account.
    // *** The req.body is only doable here because of the app.use(bodyParser.json()); line of code at the very top of this file (this body parser package installed and applied via a middleware is what enables to read data from the body object - without this code, not possible to read the body object).
    const newUser = req.body;
    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (newUser.name) {
        // ***uuid.v4(); is possible to use it because of the package imported at the beginning of the file (const uuid = require('uuid');).
        newUser.id = uuid.v4();
        // ***Used to add a new user inside the array of the variable 'users' upper every time a new user create an account.
        users.push(newUser)
        // ***Status code 201 because it means 'created'.
        res.status(201).json(newUser);
    } else {
        // ***Status 400 code because it means 'bad request'.
        res.status(400).send('Users need names')
    }
});


// ***REQUEST: Allow users to update their user info (username).
// ***PUT : The request is equal to the 'UPDATE' in the CRUD functions for systems that store data. Therefore, Express UPDATE the information of a user located at the endpoint '/users/:id' and returns a JSON object containing data about the user (updated version).
app.put('/users/:id', (req, res) => {
    // ***Creation of a new variable id and that id variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { id } = req.params;
    // ***Creation of a new variable updatedUser, and that updatedUser variable is equal to the request body data format (a JSON object holding data about the update to do) sent by the user who wishes to update his/he account.
    // *** The req.body is only doable here because of the app.use(bodyParser.json()); line of code at the very top of this file (this body parser package installed and applied via a middleware is what enables to read data from the body object - without this code, not possible to read the body object).
    const updatedUser = req.body;
    // ***Used to make sure the user exist.
    // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
    let user = users.find(user => user.id == id);

    if (user) {
        // ***Used to make the update requested by the user.
        user.name = updatedUser.name;
        // ***Status 200 code because it means 'good request'.
        res.status(200).json(user);
    } else {
        // ***Status 400 code because it means 'bad request'.
        res.status(400).send('No such user');
    }
});


// ***REQUEST: Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later).
// ***POST : The request is equal to the 'CREATE' in the CRUD functions for systems that store data (but could also have been an UPDATE). Therefore, Express POST the data sent by the user at the endpoint '/users/:id/:movieTitle' and returns a confirmation message.
app.post('/users/:id/:movieTitle', (req, res) => {
    // ***Creation of a new variable id, movieTitle and that id, movieTitle variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { id, movieTitle } = req.params;
    // ***Used to make sure the user exist.
    // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
    let user = users.find(user => user.id == id);

    // ***If the user is found, below actions happen.
    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (user) {
        // ***Used to add a new favorite movie selected by a user inside the array 'favoriteMovies' of his/her name in the variable 'users' upper.
        user.favoriteMovies.push(movieTitle)
        // ***Status 200 code because it means 'good request'.
        res.status(200).send(movieTitle + ' has been added to user ' + id + '\'s array.');
    } else {
        // ***Status 400 code because it means 'bad request'.
        res.status(400).send('Could not execute the request')
    }
});


// ***REQUEST: Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later).
// ***DELETE : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:id/:movieTitle' and returns a JSON object containing data about the account created.
app.delete('/users/:id/:movieTitle', (req, res) => {
    // ***Creation of a new variable id, movieTitle and that id, movieTitle variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { id, movieTitle } = req.params;
    // ***Used to make sure the user exist.
    // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
    let user = users.find(user => user.id == id);

    // ***If the user is found, below actions happen.
    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (user) {
        // ***Used to removed a favorite movie selected by a user inside the array 'favoriteMovies' of his/her name in the variable 'users' upper.
        // ***For the 'user.favoriteMovies.filter()', '.filter' is a method that sits on an array and take a function as an internal argument.
        // ***(title => title !== movieTitle) specify that only want the movies in our favorite movie array (favoriteMovies array for each user inside the variable 'users' upper) that dont match (!==) the one we are trying to remove.
        // ***Tree === are used (strict equality) in 'title !== movieTitle' because both values (for 'title' and 'movieTitle') are two strings. When comparing strings to strings, possible to use strict equality.
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
        // ***Status 200 code because it means 'good request'.
        res.status(200).send(movieTitle + ' has been removed from user ' + id + '\'s array.');
    } else {
        // ***Status 400 code because it means 'bad request'.
        res.status(400).send('Could not execute the request')
    }
});


// ***REQUEST: Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).
// ***DELETE : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:id' and returns a JSON object containing data about the account created.
app.delete('/users/:id', (req, res) => {
    // ***Creation of a new variable id, and that id variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { id } = req.params;
    // ***Used to make sure the user exist.
    // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
    let user = users.find(user => user.id == id);

    // ***If the user is found, below actions happen.
    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (user) {
        // ***For the 'user.filter()', '.filter' is a method that sits on an array and take a function as an internal argument.
        // ***(user => user.id !== id) specify that only want the users in the users array that dont match (!==) the one we are trying to remove.
        // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
        users = users.filter(user => user.id != id);
        // ***Status 200 code because it means 'good request'.
        res.json(users)
        // res.status(200).send('User' + id + ' has been deleted.');
    } else {
        // ***Status 400 code because it means 'bad request'.
        res.status(400).send('Could not execute the request')
    }
});


// ***Express GET route located at the endpoint '/' and that returns a string default message.
app.get('/', (req, res) => {
    res.send('This is a default return answer');
});


// ***app.use(express.static('public')); is used to serve the 'documentation.html' file from the public folder.
// ***This function automatically routes all requests for static files to their corresponding files within a certain folder on the server (in this case, the 'public' folder inside the parent folder 'movie_api'). 
// ***With this function in place, if someone requests the 'documentation.html file, Express would automatically route that request to send back a response with the 'public/documentation.html' file.
app.use(express.static('public'));


// ***This code would execute every time an error occurs in the code. Information about the current error would be logged to the terminal using err.stack, which is a property of the error parameter for the middleware function. 
// ***Error-handling middleware should always be defined last in a chain of middleware, after all other instances of app.use() and route calls (after app.get(), app.post(), etc.) but before app.listen().
// ***The first of parameters ('err') allows to receive information about whatever unexpected error brought to the current handler.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// ***app.listen(8080, () => { is used to set up the server to listen to for requests on port 8080.
// ***Every time an HTTP request hits the server, Node will deal with the request, using the request argument as the request sent to the server and the response argument as the response the server returns. But in order to do this, Node needs to be listening for a request, which is exactly what the listen method on the server object is doing. In most cases, all is needed is to pass to 'listen' is the port number you want the server to listen on (which, in this case, is 8080).
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});