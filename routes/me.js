var express = require('express');
var router = express.Router();
const util = require('util');
var form = require('express-form')

/*GET request*/
router.get('/', function(req, res, next){
    res.render('me', { user: req.user });
});

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
            res.render('update', {user:req.user, fuser:'', message:'Succesfully updated your Profile! :)'});
        }
    });
    //console.log(update_user);
    //res.render('update', {user:req.user, fuser:'', message:'Succesfully'});
})


module.exports = router;
