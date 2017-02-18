var express = require('express');
var router = express.Router();
var geocoder = require('geocoder');
const util = require('util');
var form = require('express-form')

/*GET request*/
router.get('/', function(req, res, next){
    var db = req.db;
    var collection = db.get('users');
    collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
        res.render('me', {user:docs[0], fuser:'', message:''});
    });
});

/* receiving the form and updating the information */
router.post('/', function(req, res){
    var db = req.db;
    var collection = db.get('users');
    //console.log(req.user);
    console.log(req.body.time);
    var obj_update = {};
    if (req.body.age) obj_update.age = req.body.age;
    if (req.body.location) {
        obj_update.location = req.body.location;
        geocoder.geocode(req.body.location, function ( err, data ) {
          obj_update.coord = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];
          collection.update({oauthID: req.user.oauthID},
          {
              $set: obj_update
          });
        });
    }
    if (req.body.hedu) obj_update.education = req.body.hedu;
    if (req.body.fostudy) obj_update.major = req.body.fostudy;
    obj_update.lastUpdated = Date.now();
    console.log(obj_update);
    collection.update({oauthID: req.user.oauthID},
    {
        $set: obj_update,
        $push: { waytrn1: req.body.waytrn1 }
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.send("There was a problem updating the information in the database.");
        }
        else {
            console.log(result);
            collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
                res.render('me', {user:docs[0], fuser:'', message:'Succesfully updated your Profile! :) '});
            });
        }
    });
    //console.log(update_user);
    //res.render('update', {user:req.user, fuser:'', message:'Succesfully'});
})

/*GET request*/
router.get('/pro', function(req, res, next){
    var db = req.db;
    var collection = db.get('users');
    collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
        res.render('me_pro', {user:docs[0], fuser:'', message:''});
    });
});

/* receiving the form and updating the information */
router.post('/pro', function(req, res){
    var db = req.db;
    var collection = db.get('users');
    //console.log(req.user);
    console.log(req.body.time);
    var obj_update = {};
    if (req.body.age) obj_update.age = req.body.age;
    if (req.body.location) {
        obj_update.location = req.body.location;
        geocoder.geocode(req.body.location, function ( err, data ) {
          obj_update.coord = [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];
          collection.update({oauthID: req.user.oauthID},
          {
              $set: obj_update
          });
        });
    }
    if (req.body.hedu) obj_update.education = req.body.hedu;
    if (req.body.fostudy) obj_update.major = req.body.fostudy;
    obj_update.lastUpdated = Date.now();
    console.log(obj_update);
    collection.update({oauthID: req.user.oauthID},
    {
        $set: obj_update,
        $push: { waytrn1: req.body.waytrn1 }
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.send("There was a problem updating the information in the database.");
        }
        else {
            console.log(result);
            collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
                res.render('me_pro', {user:docs[0], fuser:'', message:'Succesfully updated your Profile! :) '});
            });
        }
    });
    //console.log(update_user);
    //res.render('update', {user:req.user, fuser:'', message:'Succesfully'});
})

/*POST on update account*/
router.get('/update', function(req, res){
    res.render('update', {user:req.user, fuser:'', message:''});
});

/* receiving the form and updating the information */
router.post('/update', function(req, res){
    var db = req.db;
    var collection = db.get('users');
    //console.log(req.user);
    //console.log(req.body);
    var obj_update = {};
    if (req.body.age) obj_update.age = req.body.age;
    if (req.body.location) obj_update.location = req.body.location;
    if (req.body.hedu) obj_update.education = req.body.hedu;
    if (req.body.fostudy) obj_update.major = req.body.fostudy;
    obj_update.lastUpdated = Date.now();
    collection.update({oauthID: req.user.oauthID},
    {
        $set: obj_update,
        $push: { waytrn1: req.body.waytrn1 }
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.send("There was a problem updating the information in the database.");
        }
        else {
            console.log(result);
            collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
                res.render('update', {user:docs[0], fuser:'', message:'Succesfully updated your Profile! :)'});
            });
        }
    });
    //console.log(update_user);
    //res.render('update', {user:req.user, fuser:'', message:'Succesfully'});
})


module.exports = router;
