var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  name: String,
  firstname: String,
  lastname: String,
  email: String,
  type: String,
  waytrn1: Array,
  age: String,
  profilepic: String,
  profilelink: String,
  gender: String,
  location:String,
  coord: Array,
  created: Date
});


module.exports = User;
