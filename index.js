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
        id: 2,
        name: 'Jack Bill',
        favoriteMovies: ['']
    },
    {
        id: 2,
        name: 'Ben Cohen',
        favoriteMovies: ['Harry Potter']
    },
    {
        id: 2,
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
        res.status(400).send('no such movie')
    }
});


// ***REQUEST: Return data about a genre (description) by name (e.g., “Thriller”).
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/genres/genreName' and returns a JSON object containing data about the genre requested, allowing the user to GET/READ the info.
app.get('/movies/genre/:genreName', (req, res) => {
    // ***Creation of a new variable that is equal to req.params.title, which in turn is equal to whatever value/title the user passes through the URL and use that accordingly. So in that case 'const title' will equal whatever title the user is looking for and has been placed in the URL. Note that 'const title = req.params.title;' is not used because 'const { title } = req.params;' used below does the exact same thing - it's just written differently.
    // const title = req.params.title;

    // ***Creation of a new variable title and that title variable is equal to the property of the same name on the object that is on the right side of the equal sign.
    const { genreName } = req.params;
    // ***When 'movie.Title === title' ('movie.Title' being a movie title from the array list inside the 'movies' variable upper, and 'title' being the title searched by the user), send the current value of 'movie =>' out to the 'const movie' variable.
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    // ***Different responses (status and return messages) depending on the output of the request processing.
    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
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