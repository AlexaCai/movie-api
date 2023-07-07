//***''bycrypt'' is a module that hashes users’ passwords and compare hashed passwords every time users log in order to ensure a more secure login authentication process.
//***Hashing is the process of turning data into a string of text or numbers that can’t be turned back into the original string. Once the data has been hashed, it’s no longer accessible to anyone.
const bcrypt = require('bcrypt');

//***This line of code require(); the Mongoose package to be used in this file.
const mongoose = require('mongoose');

//***Schema for the ''Movies'' collection (schema is defined through a set of keys and values that dictate the format for the documents the collection).
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

  //***Schema for the ''Users'' collection (schema is defined through a set of keys and values that dictate the format for the documents the collection).
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  //***These codes create collections called ''db.movies'' and ''db.users'' within the MongoDB database. It creates models that use the schemas defined upper.
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  //***Used to export the models in order to then import them into ''index.js'' file. Once the models are imported into ''index.js'' file, the API endpoints can make use of them in order to query the MongoDB database according to the schemas defined.
  module.exports.Movie = Movie;
  module.exports.User = User;