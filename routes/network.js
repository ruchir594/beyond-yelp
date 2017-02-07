var express = require('express');
var router = express.Router();
var geolib = require('geolib');

/* GET to Find User Service */
router.get('/', function(req, res) {
        res.render('network', {user:req.user, fuser:'', message:''});
});

router.post('/', function(req, res) {
        var db = req.db;
        var allusers = db.get('users');
        allusers.find({}, { rawCursor: true }).then((cursor) => {
          // raw mongo cursor
          cursor.toArray()
            .then(function(relevantusers){
                var sortusers = [];
                var textMessage = '';
                relevantusers.forEach(function(item){
                    console.log(item);
                });
                res.render('network', {user: req.user, fuser: sortusers, message: textMessage});
            });
        });
});

module.exports = router;
