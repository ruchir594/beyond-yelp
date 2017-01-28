var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  name: String,
  email: String,
  type: String,
  waytrn1: Array,
  age: Number,
  profilepic: String,
  profilelink: String,
  gender: String,
  created: Date
});


module.exports = User;
