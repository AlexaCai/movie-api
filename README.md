# myFlix web app documentation (backend)

**Content**

- Projet description
- Technical aspects
-  List of endpoints and related information
- App dependencies
 
## Projet description

myFlix web app has been created to serve as a reference in the domain of visual entertainment. Users can create an account and then log into myFlix to have access to information about different movies. They can search for movies, filter results based on different criteria and create lists of favorites. myFlix has been built in two parts: the backend (here) and the frontend ([see this repository for the frontend part of mtFlix](https://github.com/AlexaCai/myFlix-client)).

The objective of this part of the project (backend) was to build an API from scratch to power and feed the movie web app and ensure easy interactions for users whenever they are accessing myFlix to read details about different movies or update their information.

*myFlix* backend development can be breakdown in the five following points:

 - **Who** — For frontend developers who’ll work on the client-side of myFlix, based on what’s been done and documented on the server-side here. For future myFlix users who'll want to read and search information about different movies as well.
 - **What** — The complete server-side of myFlix web app, including the server, business logic, and business layers of the application.
 - **When** — Whenever users of myFlix are interacting with the application, the server-side of the application will be in use, processing their requests and performing operations against the data in the database. Users will be able to use myFlix whenever they want to read information about different movies or update their user information.
 - **Where** — myFlix backend logic is hosted online (Heroku).
 - **Why** — Movie enthusiasts want to be able to access information about different movies, directors, and genres. The server-side of myFlix ensure they have access to this information, that their requests can be processed and that all necessary data can be stored.


## Technical aspects


The server-side of myFlix consists of a well-designed REST API and architected database built using the MERN tech stack (MongoDB, Express, React and Node.js). The REST API is accessed via commonly used HTTP methods (GET, PUT, POST and DELETE). Similar methods (CRUD) are used to perform operations on data stored in a non-relational database.

More precisely, the API:

-   Uses Node.js and Express framework;
-   Uses REST architecture, with URL endpoints corresponding to the operations listed in the table below;
-   Uses middleware modules such as the Body-parser package for reading data from requests and Morgan for logging;
-   Uses a package.json file;
-   Uses a MongoDB database;
-   Has a business logic modeled with Mongoose;
-   Provides movie information in JSON format;
-   Includes user authentication and authorization logic;
-   Includes data validation logic;
-   Meets data security standards;
-   Is deployed on Heroku.



## List of endpoints and related information (scroll right to see whole information)


<details>  

| Request | URL | Query parameter | HTTP method | Request body data format | Request body data format example  | Response body data format | Response body data format example |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | 
|Return a list of all movies to the user|/movies|None|GET|N.A.|N.A.|JSON object holding data about all the movies	|{"Genre": {"Name": "Science fiction", "Description": "Type of..."}, "Director": {"Name": "Steven Spielberg", "Bio": "US filmmaker...", "Birth": "December 18, 1946", "Death": "NA"}, "_id": "648c92c20fee6d37...", "Title": "Jurassic Park", "Description": "US movie...", "ImageURL": "https://www...", "Featured": "false"}, {(Other movie)} | 
| Return data (title, description, genre, director, image URL) about a single movie by title to the user|/movies/:Title	|:Title|GET|N.A.|N.A.|JSON object holding data about the movie requested|{"Genre": {"Name": "Science fiction", "Description": "Type of..."}, "Director": {"Name": "Steven Spielberg", "Bio": "US filmmaker...", "Birth": "December 18, 1946", "Death": "NA"}, "_id": "648c92c20fee6d37...", "Title": "Jurassic Park", "Description": "US movie...", "ImageURL": "https://www...", "Featured": "false"} |  
|Return data about a genre by name (e.g.: Thriller)|/movies/genre/ :genreName|:genreName|GET|N.A.|N.A.|JSON object holding data about the genre requested|{"Genre": {"Name": "Science fiction", "Description": "Type of..."}, "Director": {"Name": "Steven Spielberg", "Bio": "US filmmaker...", "Birth": "December 18, 1946", "Death": "NA"}, "_id": "648c92c20fee6d37...", "Title": "Jurassic Park", "Description": "US movie...", "ImageURL": "https://www...", "Featured": "false"}| 
|Return data about a director by name|/movies/directors/ :directorName|:directorName|GET|N.A.|N.A.|JSON object holding data about the director requested|{"Genre": {"Name": "Science fiction", "Description": "Type of..."}, "Director": {"Name": "Steven Spielberg", "Bio": "US filmmaker...", "Birth": "December 18, 1946", "Death": "NA"}, "_id": "648c92c20fee6d37...", "Title": "Jurassic Park", "Description": "US movie...", "ImageURL": "https://www...", "Featured": "false"}| 
|Allow new users to register|/users|None|POST|JSON object holding data about the user who wants to create an account|{"Username": "req.body.Username", "Password": "req.body.Password", "Email": "req.body.Email", "Birthday": "req.body.Birthday"}|JSON object holding data about the user's new account just created|{"Username": "Usertest", "Password": "Usertest", "Email": "Usertest@gmail.com", "Birthday": "1995-09-08T00:00:00.000Z", "FavoriteMovies": [], "_id": "648e8630e9d9abf...", "__v": 0}| 
|Allow users to update their user info|/users/:Username|:Username|PUT|JSON object holding data the user wants to update|{"Username": "UsertestUPDATED", "Password": "UsertestUPDATED", "Email": "UsertestUPDATE@gmail.com", "Birthday": "1995-09-08T00:00:00.000Z"}|JSON object holding data about the user's updated account|{"Username": "UsertestUPDATED", "Password": "UsertestUPDATED", "Email": "UsertestUPDATED@gmail.com", "Birthday": "1995-09-08T00:00:00.000Z", "FavoriteMovies": [], "_id": "648e8630e9d9abf...", "__v": 0}| 
|Allow users to add a movie to their list of favorites|/users/:Username/ movies/:movieID|:Username and :movieID|POST|N.A.|N.A.|JSON object holding data about the user and the new movie added|{"Username": "UsertestUPDATED", "Password": "UsertestUPDATED", "Email": "UsertestUPDATED@gmail.com", "Birthday": "1995-09-08T00:00:00.000Z", "FavoriteMovies": ["648cc4289e8b6d..."], "_id": "648e8630e9d9abf...", "__v": 0}| 
|Allow users to remove a movie from their list of favorites|/users/:Username/ movies/:movieID|:Username and :movieID|DELETE|N.A.|N.A.|JSON object holding data about the user (the movie removed not appearing anymore)|{"Username": "UsertestUPDATED", "Password": "UsertestUPDATED", "Email": "UsertestUPDATED@gmail.com", "Birthday": "1995-09-08T00:00:00.000Z", "FavoriteMovies": [], "_id": "648e8630e9d9abf...", "__v": 0}| 
|Allow existing users to deregister|/users/:Username|:Username|DELETE|N.A.|N.A.|Confirmation message that account has been deleted|"UsertestUPDATED has been deleted."| 

</details>


## App dependencies

The following dependencies are required for the myFlix backend logic to work:

- bcrypt: ^5.1.0
- body-parser: ^1.20.2
- cors: ^2.8.5
- express: ^4.18.2
- express-validator: ^7.0.1
- jsonwebtoken: ^9.0.0
- mongoose: ^7.3.0
- morgan: ^1.10.0
- passport: ^0.6.0
- passport-jwt: ^4.0.1
- passport-local: ^1.0.0
- uuid: ^9.0.0
