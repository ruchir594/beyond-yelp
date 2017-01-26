var express = require('express');
var router = express.Router();
const util = require('util');
var Yelp = require('yelp');
var config = require('../oauth.js');

var yelp = new Yelp({
  consumer_key: config.yelp.consumer_key,
  consumer_secret: config.yelp.consumer_secret,
  token: config.yelp.token,
  token_secret: config.yelp.token_secret,
});

/* GET */
router.get('/', function(req, res) {
    res.render('error');
});

/* POST to Find Restaurant*/
router.post('/', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.user.name;
    var userID = req.user.oauthID;
    var food = req.body.food;
    var place = req.body.place;

    // Set our collection
    var collection = db.get('allfoodqueries');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "id" : userID,
        "food": food,
        "place": place
    }, function (err, doc) {
        if (err) {
            console.log(util.inspect(err, false, null))
            // If it failed, return error
            //res.send("Hmmm, something seems to be not working...");
        }
        else {
            // And forward to success page
            // See http://www.yelp.com/developers/documentation/v2/search_api

            //res.render('account', { user: req.user, query: req.body, result: data1});
        }
    });
    yelp.search({ term: req.body.food, location: req.body.place })
    .then(function (data) {
      res.render('account', { user: req.user, query: req.body, result: JSON.stringify(data)});
    })
    .catch(function (err) {
        console.log(util.inspect(err, false, null))
      res.send("Hmmm, something seems to be not working Yelp!...");
    });
});
module.exports = router;
