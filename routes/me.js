var express = require('express');
var router = express.Router();
const util = require('util');

/*GET request*/
router.get('/', function(req, res, next){
    res.render('me', { user: req.user });
});

/*POST on update account*/
router.get('/update', function(req, res){
    var db = req.db;
    var collection = db.get('users');
    collection.find({oauthID: req.user.oauthID}, {}, function(e, docs){
        res.render('update', {user:req.user, fuser:docs, message:''});
    });
});


module.exports = router;
