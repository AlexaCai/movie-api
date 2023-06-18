// ***Used to import Express module.
const express = require('express');
// ***Used to declare a variable that encapsulates Express’s functionality to configure the web server. This new variable is what will be use to route HTTP requests and responses.
const app = express();

// ***Used to import Body-parser module.
const bodyParser = require('body-parser')
// Used as the application of the body-parser as middleware into the app.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ***Used to import Uuid module.
const uuid = require('uuid');

// ***Used to import Morgan (preexisting library as a logging middleware, equipped to log any and all useful information about a request)
const morgan = require('morgan');
// ***The 'common' parameter in app.use(morgan('common')); below specifies that requests should be logged using Morgan’s 'common' format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response. When running code with app.use(morgan('common')); this code will returns parts of the “common” format console logging into the terminal (such as date and time of request, the method such as GET, URL path, response code and number of characters of the response that was sent back).
app.use(morgan('common'));

// ***These lines import the Mongoose package and the ''models.js'' file.
const mongoose = require('mongoose');
const Models = require('./models.js');

// ***These lines require the Mongoose models defined in the ''models.js'' file, so they can be used in this project/file. ''Models.Movie'' and ''Models.User'' refer to the model names defined in the ''models.js'' file. Once the models are imported into ''index.js'' file, the API endpoints can make use of them in order to query the MongoDB database according to the schemas defined in ''models.js''.
const Movies = Models.Movie;
const Users = Models.User;

//*** Allows Mongoose to connect to the database (see /cfDB in the path) so it can perform CRUD operations on the documents it contains from within the REST API.
mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });


// ***App users
let users = [
    {
        id: 1,
        name: 'Jack Bill',
        favoriteMovies: ['Die hard']
    },
    {
        id: 2,
        name: 'Ben Cohen',
        favoriteMovies: ['The blind side']
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
        DOMExceptionescription: 'The movie follows Harry\'s first year at Hogwarts School of Witchcraft and Wizardry as he discovers that he is a famous wizard and begins his formal wizarding education.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy is about magic or supernatural forces, as opposed to technology as seen in science fiction. Depending on the extent of these other elements, the story may or may not be considered to be a "hybrid genre" series; for instance, even though the Harry Potter series canon includes the requirement of a particular gene to be a wizard, it is referred to only as a fantasy series.'
        },
        Director: {
            Name: 'Chris Columbus',
            Bio: 'Chris Joseph Columbus is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking. After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987). Columbus gained recognition soon after with the highly successful Christmas comedy Home Alone (1990) and its sequel Home Alone 2: Lost in New York (1992).The comedy Mrs. Doubtfire (1993), starring Robin Williams, was another box office success for Columbus. He went on to direct several other films throughout the 1990s, which were mostly met with lukewarm reception. However, he found commercial success again for directing the film adaptations of J. K. Rowling\'s novels, Harry Potter and the Sorcerer\'s Stone (2001) and its sequel, Harry Potter and the Chamber of Secrets (2002), which are his highest-grossing films to date. In addition to directing, Columbus was a producer for Harry Potter and the Prisoner of Azkaban (2004), and the drama The Help (2011). He also directed the fantasy Percy Jackson & the Olympians: The Lightning Thief (2010) and the 3D action comedy Pixels (2015).',
            Birth: 'September 10, 1958'
        },
        ImageURL: 'https://www.imdb.com/title/tt0241527/mediaviewer/rm2105413120/?ref_=tt_ov_i',
    },
    {
        Title: 'Jurassic Park',
        DOMExceptionescription: 'Jurassic Park is a 1993 american movie directed by Steven Spielberg, produced by Kathleen Kennedy and Gerald R. Molen, and starring Sam Neill, Laura Dern, Jeff Goldblum, and Richard Attenborough. It is the first installment in the Jurassic Park franchise, and the first film in the original Jurassic Park trilogy, and is based on Michael Crichton\'s 1990 novel of the same name, with a screenplay by Crichton and David Koepp. The film is set on the fictional island of Isla Nublar, off Central America\'s Pacific Coast near Costa Rica, where a wealthy businessman, John Hammond (Attenborough), and a team of genetic scientists have created a wildlife park of de-extinct dinosaurs. When industrial sabotage leads to a catastrophic shutdown of the park\'s power facilities and security precautions, a small group of visitors, including Hammond\'s grandchildren, struggle to survive and escape the now perilous island.',
        Genre: {
            Name: 'Science fiction',
            Description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, mutants, interstellar travel, time travel, or other technologies. Science fiction films have often been used to focus on political or social issues, and to explore philosophical issues like the human condition.'
        },
        Director: {
            Name: 'Steven Spielberg',
            Bio: 'Steven Allan Spielberg is an American filmmaker. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history. He is the recipient of many accolades, including three Academy Awards, two BAFTA Awards, and four Directors Guild of America Awards, as well as the AFI Life Achievement Award in 1995, the Kennedy Center Honor in 2006, the Cecil B. DeMille Award in 2009 and the Presidential Medal of Freedom in 2015. Seven of his films have been inducted into the National Film Registry by the Library of Congress as "culturally, historically or aesthetically significant".',
            Birth: 'December 18, 1946'
        },
        ImageURL: 'https://www.imdb.com/title/tt0107290/mediaviewer/rm3913805824/?ref_=tt_ov_i',
    },
    {
        Title: 'Kon-Tiki',
        DOMExceptionescription: 'Kon-Tiki is a 2012 historical drama film directed by Joachim Rønning and Espen Sandberg about the 1947 Kon-Tiki expedition. The film was mainly shot on the island of Malta. The role of Thor Heyerdahl is played by Pål Sverre Hagen. The film is an international co-production between Norway, Denmark, Germany, Sweden, and the United Kingdom.',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject-matter, or else they qualify the otherwise serious tone of a drama with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.'
        },
        Director: {
            Name: 'Joachim Rønning and Espen Sandberg',
            Bio: 'Joachim Rønning is a Norwegian film director who previously worked in a partnership with Espen Sandberg, both of whom came from Sandefjord, Norway. As a directing team, they went under the name of Roenberg (a portmanteau of their surnames). They co-own one of Scandinavia\'s largest production companies for commercials called Motion Blur. Rønning now develops and directs film and television as a solo director. Espen Sandberg is a Norwegian film director and advertising producer, well known to work with his childhood friend and director Joachim Rønning on several projects such as Bandidas (2006), Max Manus: Man of War (2008), Kon-Tiki (2012) and Pirates of the Caribbean: Dead Men Tell No Tales (2017). He received a nomination at 85th Academy Awards as well as 70th Golden Globe Awards for Best Foreign Language Film for directing 2012 movie Kon-Tiki with Rønning. ',
            Birth: 'May 30, 1972 (Joachim Rønning) and June 2, 1971 (Espen Sandberg)'
        },
        ImageURL: 'https://www.imdb.com/title/tt1613750/mediaviewer/rm3784681728/?ref_=tt_ov_i',
    },
    {
        Title: 'The godfather',
        DOMExceptionescription: 'The Godfather is a 1972 American crime film directed by Francis Ford Coppola, who co-wrote the screenplay with Mario Puzo, based on Puzo\'s best-selling 1969 novel of the same title. The film stars Marlon Brando, Al Pacino, James Caan, Richard Castellano, Robert Duvall, Sterling Hayden, John Marley, Richard Conte, and Diane Keaton. It is the first installment in The Godfather trilogy, chronicling the Corleone family under patriarch Vito Corleone (Brando) from 1945 to 1955. It focuses on the transformation of his youngest son, Michael Corleone (Pacino), from reluctant family outsider to ruthless mafia boss.',
        Genre: {
            Name: 'Crime',
            Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film, but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir.'
        },
        Director: {
            Name: 'Francis Ford Coppola',
            Bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s. Coppola is the recipient of five Academy Awards, six Golden Globe Awards, two Palmes d\'Or and a British Academy Film Award (BAFTA).',
            Birth: 'April 7, 1939'
        },
        ImageURL: 'https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i',
    },
    {
        Title: 'Coach Carter',
        DOMExceptionescription: 'Coach Carter is a 2005 American biographical teen sports drama film starring Samuel L. Jackson and directed by Thomas Carter (no relation). It is based on the true story of Richmond High School basketball coach Ken Carter, who made headlines in 1999 for suspending his undefeated high school basketball team due to poor academic results. The story was conceived from a screenplay co-written by John Gatins and Mark Schwahn. The ensemble cast features Rob Brown, Channing Tatum, Debbi Morgan, Robert Ri\'chard and singer Ashanti.',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject-matter, or else they qualify the otherwise serious tone of a drama with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.'
        },
        Director: {
            Name: 'Thomas Carter',
            Bio: 'Thomas Colbert Carter is an American film and television director, producer and actor, known for Swing Kids, Save the Last Dance and Coach Carter. As an actor, Carter is probably best known for his work on the television series The White Shadow, playing James "Hollywood" Hayward.',
            Birth: 'July 17, 1953'
        },
        ImageURL: 'https://www.imdb.com/title/tt0393162/mediaviewer/rm2796356096/?ref_=tt_ov_i',
    },
    {
        Title: 'Gladiator',
        DOMExceptionescription: 'Gladiator is a 2000 epic historical drama film directed by Ridley Scott and written by David Franzoni, John Logan, and William Nicholson. It was produced by Universal Pictures. DreamWorks Pictures distributed the film in North America while Universal Pictures released it internationally through United International Pictures. It stars Russell Crowe, Joaquin Phoenix, Connie Nielsen, Tomas Arana, Ralf Möller, Oliver Reed (in his final role), Djimon Hounsou, Derek Jacobi, John Shrapnel, Richard Harris, and Tommy Flanagan. Crowe portrays Roman general Maximus Decimus Meridius, who is betrayed when Commodus, the ambitious son of Emperor Marcus Aurelius, murders his father and seizes the throne. Reduced to slavery, Maximus becomes a gladiator and rises through the ranks of the arena to avenge the murders of his family and his emperor.',
        Genre: {
            Name: 'Historical drama',
            Description: 'A historical drama (also period drama, period piece or just period) is a dramatic work set in a past time period, usually used in the context of film and television, which presents historical events and characters with varying degrees of fictional elements such as creative dialogue or fictional scenes which aim to compress separate events or illustrate a broader factual narrative. The biographical film is a type of historical drama which generally focuses on a single individual or well-defined group. Historical dramas can include romances, adventure films, and swashbucklers.'
        },
        Director: {
            Name: 'Ridley Scott',
            Bio: 'Sir Ridley Scott is an English film director and producer. Best known for directing films in the science fiction, crime, and historical drama genres, his work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades throughout his career, two Primetime Emmy Awards, a Golden Globe Award, and the BAFTA Fellowship in 2018. In 2003, he was knighted by Queen Elizabeth II. In a 2004 BBC poll, Scott was ranked 10 on the list of most influential people in British culture.',
            Birth: 'November 30, 1937) '
        },
        ImageURL: 'https://www.imdb.com/title/tt0172495/mediaviewer/rm2442542592/?ref_=tt_ov_i',
    },
    {
        Title: 'The pirates of Somalia',
        DOMExceptionescription: 'The Pirates of Somalia (or simply Pirates of Somalia in the UK) is a 2017 American drama film written and directed by Bryan Buckley, and based on the 2011 book of the same name. The film stars Evan Peters, Al Pacino, Melanie Griffith, and Barkhad Abdi. The film had its world premiere at the Tribeca Film Festival on April 27, 2017. The film was released on December 8, 2017, by Echo Bridge.',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject-matter, or else they qualify the otherwise serious tone of a drama with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.'
        },
        Director: {
            Name: 'Bryan Buckley',
            Bio: 'Bryan Buckley is an American filmmaker, screenwriter, producer, and two time Academy-Award nominated director. His successful career has led to him being dubbed the “King of the Super Bowl."Buckley\'s directorial debut came with a series of commercials he created for NHL on ESPN, before creating the “This is SportsCenter” campaign for ESPN in 1999. The work became a part of the ESPN brand, and launched Buckley into the commercial world. Buckley would go on to direct 64 Super Bowl Commercials.',
            Birth: 'September 3, 1963'
        },
        ImageURL: 'https://www.imdb.com/title/tt5126922/mediaviewer/rm1602771200/?ref_=tt_ov_i',
    },
    {
        Title: 'Blood diamond',
        DOMExceptionescription: 'Blood Diamond is a 2006 American political action thriller film directed and co-produced by Edward Zwick and starring Leonardo DiCaprio, Jennifer Connelly, and Djimon Hounsou. The title refers to blood diamonds, which are diamonds mined in war zones and sold to finance conflicts, and thereby profit warlords and diamond companies around the world. Set during the Sierra Leone Civil War from 1991 to 2002, the film depicts a country torn apart by the struggle between government loyalists and insurgent forces. It also portrays many of the atrocities of that war, including the rebels\' amputation of civilians\' hands to discourage them from voting in upcoming elections.',
        Genre: {
            Name: 'Thriller',
            Description: 'A thriller is a story that is usually a mix of fear and excitement. It has traits from the suspense genre and often from the action, adventure or mystery genres, but the level of terror makes it borderline horror fiction at times as well. It generally has a dark or serious theme, which also makes it similar to drama.'
        },
        Director: {
            Name: 'Edward Zwick',
            Bio: 'Edward M. Zwick is an American filmmaker and producer of film and television. He has worked primarily in the comedy drama and epic historical film genres, including About Last Night, Glory, Legends of the Fall, and The Last Samurai. He is also the co-creator of the television series thirtysomething and Once and Again.',
            Birth: 'October 8, 1952'
        },
        ImageURL: 'https://www.imdb.com/title/tt0450259/mediaviewer/rm3284992512/?ref_=tt_ov_i',
    },
    {
        Title: 'Ratatouille',
        DOMExceptionescription: 'Ratatouille is a 2007 American computer-animated comedy-drama film produced by Pixar Animation Studios and released by Walt Disney Pictures. The eighth film produced by Pixar, it was written and directed by Brad Bird, who took over from Jan Pinkava in 2005, and produced by Brad Lewis, from an original idea by Pinkava, who was credited for conceiving the film\'s story with Bird and Jim Capobianco. The film stars the voices of Patton Oswalt, Lou Romano, Ian Holm, Janeane Garofalo, Peter O\'Toole, Brian Dennehy, Peter Sohn, and Brad Garrett. The title refers to the French dish ratatouille, which is served at the end of the film, and also references the species of the main character, a rat. Set in Paris, the plot follows a young rat Remy (Oswalt) who dreams of becoming a chef at Auguste Gusteau\'s (Garrett) restaurant and tries to achieve his goal by forming an unlikely alliance with the restaurant\'s garbage boy Alfredo Linguini (Romano).',
        Genre: {
            Name: 'Comedy drama',
            Description: 'Comedy drama, also known by the portmanteau dramedy, is a genre of dramatic works that combines elements of comedy and drama. The modern, scripted-television examples tend to have more humorous bits than simple comic relief seen in a typical hour-long legal or medical drama, but exhibit far fewer jokes-per-minute as in a typical half-hour sitcom.'
        },
        Director: {
            Name: 'Brad Bird',
            Bio: 'Phillip Bradley Bird is an American film director, animator, screenwriter, producer and voice actor. He has had a career spanning forty years in both animation and live-action. Bird was born in Montana and grew up in Oregon. He developed an interest in the art of animation early on, and completed his first short subject by age 14. Bird sent the film to Walt Disney Productions, leading to an apprenticeship from the studio\'s Nine Old Men. He attended the California Institute of the Arts in the late 1970s, and worked for Disney shortly thereafter.',
            Birth: 'September 24, 1957'
        },
        ImageURL: 'https://www.imdb.com/title/tt0382932/mediaviewer/rm937921792/?ref_=tt_ov_i',
    },
    {
        Title: 'Princess Mononoke',
        DOMExceptionescription: 'Princess Mononoke is a 1997 Japanese animated epic historical fantasy film written and directed by Hayao Miyazaki and animated by Studio Ghibli for Tokuma Shoten, Nippon Television Network and Dentsu. The film stars the voices of Yōji Matsuda, Yuriko Ishida, Yūko Tanaka, Kaoru Kobayashi, Masahiko Nishimura, Tsunehiko Kamijo, Akihiro Miwa, Mitsuko Mori, and Hisaya Morishige.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy is about magic or supernatural forces, as opposed to technology as seen in science fiction. Depending on the extent of these other elements, the story may or may not be considered to be a "hybrid genre" series.'
        },
        Director: {
            Name: 'Hayao Miyazaki',
            Bio: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.',
            Birth: 'January 5, 1941'
        },
        ImageURL: 'https://www.imdb.com/title/tt0119698/mediaviewer/rm2697706753/?ref_=tt_ov_i',
    },
];


// ***REQUEST: Return a list of all movies to the user.
// ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies' and returns a JSON object containing data about the movies list (data inside the variable movies upper), allowing the user to GET/READ the info.
// app.get('/movies', (req, res) => {
//     res.status(200).json(movies);
// });

// ***REQUEST: Return a list of all movies to the user.
// ***READ (with MONGOOSE) : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies' and returns a JSON object containing data about the movies list (data inside the variable movies upper), allowing the user to GET/READ the info.
app.get('/movies', (req, res) => {
    //***The .find() function in Mongoose grabs data in the database of all the movies, since no specific movie was specified in the request. Rather than querying db.movies.find() like on MongoDB (as we're not querying the database itself), Movies.find() is used via Mongoose to query the Movies model.
    Movies.find()
        //***After the document is created, a response is sent back to the client with the movies data (document) that was just read/requested. The parameter for this callback, which is named ''movies'' here refers, by default, to the documents (each movie = one document) that were just read.
        .then((movies) => {
            res.json(movies);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// // ***REQUEST: Return data - title, description, genre, director, image URL) about a single movie by title to the user.
// // ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies' and returns a JSON object containing data about the movies requested, allowing the user to GET/READ the info.
// app.get('/movies/:title', (req, res) => {
//     // ***Creation of a new variable that is equal to req.params.title, which in turn is equal to whatever value/title the user passes through the URL and use that accordingly. So in that case 'const title' will equal whatever title the user is looking for and has been placed in the URL. Note that 'const title = req.params.title;' is not used because 'const { title } = req.params;' used below does the exact same thing - it's just written differently.
//     // const title = req.params.title;

//     // ***Creation of a new variable title and that title variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { title } = req.params;
//     // ***When 'movie.Title === title' ('movie.Title' being a movie title from the array list inside the 'movies' variable upper, and 'title' being the title searched by the user), send the current value of 'movie =>' out to the 'const movie' variable.
//     const movie = movies.find(movie => movie.Title === title);

//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (movie) {
//         res.status(200).json(movie);
//     } else {
//         res.status(400).send('No such movie')
//     }
// });

// ***REQUEST: Return data - title, description, genre, director, image URL) about a single movie by title to the user.
// ***READ (WITH MONGOOSE) : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/:title' and returns a JSON object containing data about the movies requested, allowing the user to GET/READ the info.
app.get('/movies/:Title', (req, res) => {
    //***The .findOne({ Title: req.params.Title }) function in Mongoose grabs data in the database on the specified Title from the request. Rather than querying db.movies.findOne( { Title: 'ABC' } ) like on MongoDB (as we're not querying the database itself), Movies.findOne({ Title: req.params.Title }) is used via Mongoose to query the Movies model.
    Movies.findOne({ Title: req.params.Title })
        //***After the document is created, a response is sent back to the client with the movie data (document) that was just read/requested. The parameter for this callback, which is named ''movie'' here refers, by default, to the document that was just read.
        .then((movie) => {
            res.json(movie);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// // ***REQUEST: Return data about a genre by name (e.g., “Thriller”).
// // ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/genres/genreName' and returns a JSON object containing data about the genre requested, allowing the user to GET/READ the info.
// app.get('/movies/genre/:genreName', (req, res) => {

//     // ***Creation of a new variable genreName, and that genreName variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { genreName } = req.params;
//     // ***movies.find(movie => movie.Genre.Name === genreName).Genre; returns the value for the 'Genre' searched and present inside the array list in the movies variable upper. The '.Genre' at the end is important because that's what make it possible to returns the specific propertie of a searched 'Genre' from the array list movies. Otherwise, this method would returns the value of the entire object of a movie containing the searched genre.
//     const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (genre) {
//         res.status(200).json(genre);
//     } else {
//         res.status(400).send('No such genre')
//     }
// });

// ***REQUEST: Return data about a genre by name (e.g.: Thriller).
// ***READ (with MONGOOSE): The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/genres/genreName' and returns a JSON object containing data about the genre requested, allowing the user to GET/READ the info.
app.get('/movies/genre/:genreName', (req, res) => {
    //***The .findOne({ 'Genre.Name': req.params.genreName }) function in Mongoose grabs data in the database on the specified Genre from the request. Rather than querying db.movies.findOne( { Genre.Name: 'Drama' } ) like on MongoDB (as we're not querying the database itself), Movies.findOne({ 'Genre.Name': req.params.genreName }) is used via Mongoose to query the Movies model.
    Movies.findOne({ 'Genre.Name': req.params.genreName })
        //***After the document is created, a response is sent back to the client with the genre data that was just read/requested. The parameter for this callback, which is named ''genre'' here refers, by default, to the document that was just read.
        .then((genre) => {
            res.json(genre);
        })
        //***Error-handling function at the end to catch any errors that may occur.
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// // ***REQUEST: Return data about a director (bio and birth year) by name.
// // ***READ : The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/directors/:directorName' and returns a JSON object containing data about the director requested, allowing the user to GET/READ the info.
// app.get('/movies/directors/:directorName', (req, res) => {

//     // ***Creation of a new variable directorName, and that directorName variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { directorName } = req.params;
//     // ***movies.find(movie => movie.Director.Name === directorName).Director; returns the value for the 'Director' searched and present inside the array list in the movies variable upper. The '.Director' at the end is important because that's what make it possible to returns the specific propertie of a searched 'Director' from the array list movies. Otherwise, this method would returns the value of the entire object of a movie containing the searched director.
//     const director = movies.find(movie => movie.Director.Name === directorName).Director;

//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (director) {
//         res.status(200).json(director);
//     } else {
//         res.status(400).send('No such director')
//     }
// });

// ***REQUEST: Return data about a director (bio and birth year) by name.
// ***READ (with MONGOOSE): The request is equal to the 'READ' in the CRUD functions for systems that store data. Therefore, Express GET route located at the endpoint '/movies/directors/:directorName' and returns a JSON object containing data about the director requested, allowing the user to GET/READ the info.
app.get('/movies/directors/:directorName', (req, res) => {
    //***The .findOne({ 'Director.Name': req.params.directorName }) function in Mongoose grabs data in the database on the specified Director from the request. Rather than querying db.movies.findOne( { Director.Name: 'Thomas Carter' } ) like on MongoDB (as we're not querying the database itself), .findOne({ 'Director.Name': req.params.directorName }) is used via Mongoose to query the Movies model.
    Movies.findOne({ 'Director.Name': req.params.directorName })
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


// ***REQUEST: Allow new users to register.
// ***POST (WITH MONGOOSE): The request is equal to the 'CREATE' in the CRUD functions for systems that store data. Therefore, Express POST the data sent by the user at the endpoint '/users' and returns a JSON object containing data about the account created.
app.post('/users', (req, res) => {
    //***.findOne({ Name: req.body.Name }) first check if a user with the username provided by the client already exists. The .findOne command is querying the ''Users'' model using Mongoose.
    Users.findOne({ Name: req.body.Name })
        .then((user) => {
            if (user) {
                //***If the given name does exist, then app send back the appropriate response to the client (name thats trying to be create already exists).
                return res.status(400).send(req.body.Name + ' already exists');
            } else {
                //***If the given name that the client tries to create doesn’t exist, the Mongoose’s create command is used to CREATE the new user.
                Users
                    //***The create command takes an object, where each key in the object corresponds to a certain field specified in the schema (from the 'models.js' file for the User model) and each value is set to a value that is received from the request body (via req.body) sent by the client.
                    //***The use of req.body.Name (or req.body.Password or else) allows to collect all of the information from the HTTP request body sent by the client, use Mongoose to populate a user document inside the Users collection, then add it to the database.
                    //***Mongoose is translating here Node.js code into a MongoDB command that runs behind the scenes to insert a record into your ''Users'' collection. The application here uses Mongoose’s CREATE command on the model to execute this database operation on MongoDB automatically.
                    .create({
                        Name: req.body.Name,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    //***After the document is created, a callback takes the document just added as a parameter (here, this new document is given the name ''user'', but it could have been named any other name).
                    //***Within this callback, a response is sent back to the client that contains both a status code and the document (called ''user'') that has been just created (res.status(201).json(newUser)). This gives the client feedback on his request, letting them know that it’s been completed.
                    .then((user) => { res.status(201).json(user) })
                    //***Error-handling function - a catch-all in case the command/request runs into an error.
                    //***The .catch function will ''catch'' any problems that Mongoose encounters while running the create command. 
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// // ***REQUEST: Allow users to update their user info (name).
// // ***PUT : The request is equal to the 'UPDATE' in the CRUD functions for systems that store data. Therefore, Express UPDATE the information of a user located at the endpoint '/users/:id' and returns a JSON object containing data about the user (updated version).
// app.put('/users/:id', (req, res) => {
//     // ***Creation of a new variable id and that id variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { id } = req.params;
//     // ***Creation of a new variable updatedUser, and that updatedUser variable is equal to the request body data format (a JSON object holding data about the update to do) sent by the user who wishes to update his/he account.
//     // *** The req.body is only doable here because of the app.use(bodyParser.json()); line of code at the very top of this file (this body parser package installed and applied via a middleware is what enables to read data from the body object - without this code, not possible to read the body object).
//     const updatedUser = req.body;
//     // ***Used to make sure the user exist.
//     // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
//     let user = users.find(user => user.id == id);

//     if (user) {
//         // ***Used to make the update requested by the user.
//         user.name = updatedUser.name;
//         // ***Status 200 code because it means 'good request'.
//         res.status(200).json(user);
//     } else {
//         // ***Status 400 code because it means 'bad request'.
//         res.status(400).send('No such user');
//     }
// });

//***REQUEST: Allow users to update their user info (name).
//***PUT (with MONGOOSE): The request is equal to the 'UPDATE' in the CRUD functions for systems that store data. Therefore, Express UPDATE the information of a user located at the endpoint '/users/:Name' and returns a JSON object containing data about the user (updated version).
app.put('/users/:Name', (req, res) => {
    //***.findOneAndUpdate({ Name: req.body.params.Name }) searches for the user that wish to be updated in the database, via its name.
    Users.findOneAndUpdate({ Name: req.params.Name }, {
        //***$set is used to specifed which fields in the user document is to be update. The new values that are set on each of these specific fields to is extracted from the request body sent by the client.
        $set:
        {
            Name: req.body.Name,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        //***{ new: true } specifies that, in the proceeding callback, the document that was just updated is the one to be returned.
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
// // ***POST : The request is equal to the 'CREATE' in the CRUD functions for systems that store data (but could also have been an UPDATE). Therefore, Express POST the data sent by the user at the endpoint '/users/:id/:movieTitle' and returns a confirmation message.
// app.post('/users/:id/:movieTitle', (req, res) => {
//     // ***Creation of a new variable id, movieTitle and that id, movieTitle variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { id, movieTitle } = req.params;
//     // ***Used to make sure the user exist.
//     // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
//     let user = users.find(user => user.id == id);

//     // ***If the user is found, below actions happen.
//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (user) {
//         // ***Used to add a new favorite movie selected by a user inside the array 'favoriteMovies' of his/her name in the variable 'users' upper.
//         user.favoriteMovies.push(movieTitle)
//         // ***Status 200 code because it means 'good request'.
//         res.status(200).send(movieTitle + ' has been added to user ' + id + '\'s list of favorite movies.');
//     } else {
//         // ***Status 400 code because it means 'bad request'.
//         res.status(400).send('Could not execute the request')
//     }
// });

// // ***REQUEST: Allow users to add a movie to their list of favorites.
// // ***POST (with MONGOOSE) : The request is equal to the 'CREATE' in the CRUD functions for systems that store data (but could also have been an UPDATE). Therefore, Express POST the data sent by the user at the endpoint '/users/:Name/movies/:MovieID' and returns a confirmation message.
app.post('/users/:Name/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Name: req.params.Name }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }
     )
     //***Answer to the client if the update worked ('updatedUser' being the newly updated data/document of the user).
     .then((updatedUserMovie) => {
         res.json(updatedUserMovie);
     })
     //***Error-handling function at the end to catch any errors that may occur.
     .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
     })
});


// // ***REQUEST: Allow users to remove a movie from their list of favorites.
// // ***DELETE : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:id/:movieTitle' and returns a JSON object containing data about the account for which the movie has been deleted.
// app.delete('/users/:id/:movieTitle', (req, res) => {
//     // ***Creation of a new variable id, movieTitle and that id, movieTitle variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { id, movieTitle } = req.params;
//     // ***Used to make sure the user exist.
//     // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
//     let user = users.find(user => user.id == id);

//     // ***If the user is found, below actions happen.
//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (user) {
//         // ***Used to removed a favorite movie selected by a user inside the array 'favoriteMovies' of his/her name in the variable 'users' upper.
//         // ***For the 'user.favoriteMovies.filter()', '.filter' is a method that sits on an array and take a function as an internal argument.
//         // ***(title => title !== movieTitle) specify that only want the movies in our favorite movie array (favoriteMovies array for each user inside the variable 'users' upper) that dont match (!==) the one we are trying to remove.
//         // ***Tree === are used (strict equality) in 'title !== movieTitle' because both values (for 'title' and 'movieTitle') are two strings. When comparing strings to strings, possible to use strict equality.
//         user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
//         // ***Status 200 code because it means 'good request'.
//         res.status(200).send(movieTitle + ' has been removed from user ' + id + '\'s list of favorite movies.');
//     } else {
//         // ***Status 400 code because it means 'bad request'.
//         res.status(400).send('Could not execute the request')
//     }
// });

//***REQUEST: Allow users to remove a movie from their list of favorites.
//***DELETE (with MONGOOSE) : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:Name/movies/:MovieID' and returns a JSON object containing data about the account for which the movie has been deleted.
//***Code exactly the same as when a client add a movieID, only this time the $pull operator is used instead of the $push operator, and the app.post is modified to app.delete.
app.delete('/users/:Name/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Name: req.params.Name }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }
     )
     //***Answer to the client if the update worked ('updatedUser' being the newly updated data/document of the user).
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
// ***DELETE : The request is equal to the 'DELETE' in the CRUD functions for systems that store data. Therefore, Express DELETE the data sent by the user at the endpoint '/users/:id' and returns a JSON object containing data about the account created.
// app.delete('/users/:id', (req, res) => {
//     // ***Creation of a new variable id, and that id variable is equal to the property of the same name on the object that is on the right side of the equal sign.
//     const { id } = req.params;
//     // ***Used to make sure the user exist.
//     // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
//     let user = users.find(user => user.id == id);

//     // ***If the user is found, below actions happen.
//     // ***Different responses (status and return messages) depending on the output of the request processing.
//     if (user) {
//         // ***For the 'user.filter()', '.filter' is a method that sits on an array and take a function as an internal argument.
//         // ***(user => user.id !== id) specify that only want the users in the users array that dont match (!==) the one we are trying to remove.
//         // ***Note about the two == here : The 'user.id' in 'user.id == id' is a NUMBER (as seen in the 'users' variable array upper on the 'id' propertie), and the 'id' in the 'user.id == id' is a STRING pulled from the URL string '/users/:id' inserted by the user. Thats why in 'user.id == id', there are only two == used. Because if tree === are used (strict equality), the 'user.id' wouldnt be equal to 'id', but by using two ==, they will be equal (they will be true/satisfied condition, even if one is a NUMBER and the other is a STRING).
//         users = users.filter(user => user.id != id);
//         // ***Status 200 code because it means 'good request'.
//         res.status(200).send('User ' + id + ' has been deleted.');
//     } else {
//         // ***Status 400 code because it means 'bad request'.
//         res.status(400).send('Could not execute the request')
//     }
// });

app.delete('/users/:Name', (req, res) => {
    Users.findOneAndRemove({ Name: req.params.Name })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Name + ' was not found');
        } else {
          res.status(200).send(req.params.Name + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
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