//***''bycrypt'' is a module that hashes users’ passwords and compare hashed passwords every time users log in order to ensure a more secure login authentication process.
const bcrypt = require('bcrypt');


const mongoose = require('mongoose');


//***Schema for the ''Movies'' collection.
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


  //***Schema for the ''Users'' collection.
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

  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  
  module.exports.Movie = Movie;
  module.exports.User = User;