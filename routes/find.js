var express = require('express');
var router = express.Router();
const util = require('util');
//var Yelp = require('yelp');
const yelp = require('yelp-fusion');
var config = require('../oauth.js');

/*var yelp = new Yelp({
  consumer_key: config.yelp.consumer_key,
  consumer_secret: config.yelp.consumer_secret,
  token: config.yelp.token,
  token_secret: config.yelp.token_secret,
});*/

const clientId = config.yelpfusion.AppID;
const clientSecret = config.yelpfusion.AppSecret;



/* GET */
router.get('/', function(req, res) {
    res.redirect('/home');
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

    const searchRequest = {
      term:req.body.food,
      location: req.body.place,
      limit: 25
    };

    // Set our collection
    var collection = db.get('allfoodqueries');
    var allusers = db.get('users').find( );

    console.log(allusers);

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
        }
    });
      yelp.accessToken(clientId, clientSecret).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search(searchRequest).then(response => {
        const allResult = response.jsonBody.businesses;
        res.render('home', {
            user: req.user,
            query: req.body,
            result: allResult,
            fillers: {"flr1": " Looking for ", "flr2": " at "}});
      });
    }).catch(e => {
      console.log(e);
    });
});
module.exports = router;
