var express = require('express');
var router = express.Router();
var geolib = require('geolib');
var geocoder = require('geocoder');

/* GET to Find User Service */
router.get('/', function(req, res) {
        res.render('network', {user:req.user, fuser:'', message:''});
});

router.post('/', function(req, res) {
        var db = req.db;
        var allusers = db.get('users');
        geocoder.geocode(req.body.place, function ( err, data ) {
         var ucoord = {
             latitude: data.results[0].geometry.location.lat,
             longitude: data.results[0].geometry.location.lng };
         allusers.find({}, { rawCursor: true }).then((cursor) => {
           // raw mongo cursor
           cursor.toArray()
             .then(function(relevantusers){
                 var sortusers = [];
                 var textMessage = '';
                 relevantusers.forEach(function(item){
                     var distance = geolib.getDistance(ucoord, {latitude: item.coord[0], longitude: item.coord[1]});
                     if(distance < 10000){
                         sortusers.push(item);
                     }
                 });
                 res.render('network', {user: req.user, fuser: sortusers, message: textMessage});
             });
         });
     });


});

module.exports = router;
