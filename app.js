var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var session = require('express-session')
var mongo = require('mongodb');
var monk = require('monk');
var assert = require('assert');
var mongoose = require('mongoose');
var db = monk('localhost:27017/store1');
var engines = require('consolidate');
var passport = require('passport');
var config = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
//var InstagramStrategy = require('passport-instagram').Strategy;

var index = require('./routes/index');
var User = require('./routes/user.js');
var fbAuth = require('./authentication.js');
var fbl = require('./routes/fbl');
var find = require('./routes/find');
var me = require('./routes/me');
var network = require('./routes/network');
var rooster = require('./routes/rooster');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// connect to the database
// mongo config
mongoose.connect('localhost:27017/store1');


// config

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(session({ secret: 'my_precious', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user);
      if(!err) done(null, user);
      else done(err, null);
    });
});

// view engine setup
//
//app.set('view engine', 'jade');
//app.engine('jade', engines.jade);
//app.engine('handlebars', engines.handlebars);
//app.set('view engine', 'ejs');

app.use(function(req,res,next){
    req.db = db;
    next();
});

//app.use('/', index);
//app.use('/users', users);
//app.use('/fbl', fbl);
// routes
app.use('/', index);
app.use('/find', find);
app.use('/me', me);
app.use('/network', network);
app.use('/rooster', rooster);
//app.use('/ping', ping);
app.get('/home', ensureAuthenticated, function(req, res){
    res.render('home', {
        user:req.user
    });
});
app.get('/food', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);  // handle errors
    } else {
        var db = req.db;
        var allusers = db.get('users');
        allusers.find({}, { rawCursor: true }).then((cursor) => {
          // raw mongo cursor
          cursor.toArray()
            .then(function(relevantusers){
                if(user.location=="Locality, City, Country."){
                    res.render('me', {user:user, fuser:'', message:'Please update your Profile to get started!'});
                }
                else {
                res.render('food', {
                    user: user,
                    relevantusers: relevantusers,
                    query: {"food":"", "place":""},
                    result: "",
                    fillers: {"flr1": "", "flr2": "", "flr3": ""}
                }); }
            });
        });
    }
  });
});
//app.use('/', function(req, res){
//  res.render('login', { user: req.user });
//});

app.get('/auth/facebook',
  passport.authenticate('facebook', {scope:['email', 'public_profile', 'user_friends' ]}),
  function(req, res){});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  });

app.get('/auth/google',
passport.authenticate('google', { scope: [
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/plus.profile.emails.read'
] }
));
app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
  res.redirect('/home');
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){});
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
