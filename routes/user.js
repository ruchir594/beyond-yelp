var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  name: String,
  email: String,
  type: String,
  waytrn1: Array,
  created: Date
});


module.exports = User;
