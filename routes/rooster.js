var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.redirect('/home');
});

router.post('/', function(req, res){
    var db = req.db;

    var userName = req.user.name;
    var userID = req.user.oauthID;
    var time = req.body.time;

    // Set our collection
    var collection = db.get('rooster');
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "id" : userID,
        "time": time
    }, function (err, doc) {
        if (err) {
            console.log(util.inspect(err, false, null))
            // If it failed, return error
            //res.send("Hmmm, something seems to be not working...");
        }
        else {
        }
    });
    res.render('home', {
        user: req.user,
        relevantusers: [],
        query: {"food":"", "place":""},
        result: "",
        fillers: {"flr1": "", "flr2": "", "flr3": "You have been added to Rooster. Like minded people will be able to find you. :) "}
    });
});

module.exports = router;
