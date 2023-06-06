// Import all necessary Node modules all at once at the top
const url = require('url');
const http = require('http');
const fs = require('fs');

// Used by const http = require('http');
http.createServer((request, response) => {
    let addr = request.url,
        // A URL string is a structured string containing multiple meaningful components (host, pathname, search). When parsed, a URL object is returned containing properties for each of these components.
        // The url.parse on the code line below shows the 3 components of the URL: the host (q.host), the pathname (q.pathname), and the serialized portion (q.search), which is everything after the question mark in the URL.
        q = url.parse(addr, true),
        filePath = '';

    // Used to make sure that whenever a request is made by a user to the server, the visited URL, as well as the timestamp at which the request was received, will be added in the log.txt file to track the most visited URL, when they are visited and so on.
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });
}).listen(8080);

