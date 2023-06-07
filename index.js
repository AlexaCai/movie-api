// ***Used to import Express module
const express = require('express');
// ***Used to import Morgan (preexisting library as a logging middleware, equipped to log any and all useful information about a request)
const morgan = require('morgan');

// ***Used to declare a variable that encapsulates Express’s functionality to configure the web server. This new variable is what will be use to route HTTP requests and responses.
const app = express();

// ***The 'common' parameter specifies that requests should be logged using Morgan’s 'common' format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response.
// ***When running code with app.use(morgan('common')); this code will returns parts of the “common” format console logging into the terminal (such as date and time of request, the method such as GET, URL path, response code and number of characters of the response that was sent back).
app.use(morgan('common'));

// ***Top movies list
let topMovies = [
    {
        title: 'Harry Potter and the Philosopher\'s Stone',
        director: 'Chris Columbus'
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg'
    },
    {
        title: 'Kon-Tiki',
        directors: 'Joachim Rønning and Espen Sandberg'
    },
    {
        title: 'The godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'Coach Carter',
        director: 'Thomas Carter'
    },
    {
        title: 'Gladiator',
        director: 'Ridley Scott'
    },
    {
        title: 'The pirates of Somalia',
        director: 'Bryan Buckley'
    },
    {
        title: 'Hotel Rwanda',
        director: 'Terry George'
    },
    {
        title: 'Blood diamond',
        director: 'Edward Zwick'
    },
    {
        title: 'Ratatouille',
        director: 'Brad Bird'
    },
    {
        title: 'Princess Mononoke',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Twilight',
        author: 'Stephanie Meyer'
    }
];

// ***Express GET route located at the endpoint '/movies' and that returns a JSON object containing data about the top movies list (variable topMovies upper)
app.get('/movies', (req, res) => {
    res.json(topMovies);
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