//*** Mongoose is installed as a local project dependency like many of the other JavaScript packages. This line of code require(); the Mongoose package to be used in that file.
const mongoose = require('mongoose');

//*** Schema for the ''Movies'' collection (schema is defined through a set of keys and values that dictate the format for the documents the collection).The keys and values can follow a number of different formats.
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: Date,
      Death: Date
    },
    ImagePath: String,
    Featured: Boolean
  });

  //*** Schema for the ''Users'' collection (schema is defined through a set of keys and values that dictate the format for the documents the collection).The keys and values can follow a number of different formats.
  let userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  //*** Create collections called ''db.movies'' and ''db.users'' within the MongoDB database. It creates models that use the schemas defined upper.
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  //*** Used to export the models in order to then import them into ''index.js'' file. Once the models are imported into ''index.js'' file, the API endpoints can make use of them in order to query the MongoDB database according to the schemas defined.
  module.exports.Movie = Movie;
  module.exports.User = User;