var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fbl', { title: 'Facebook login', love: 'Kiss' });
});

router.get('/ejs', function(req, res, next) {
  res.render('fbl.ejs');
});

router.get('/auth/facebook', function(req, res, next) {
  passport.authenticate('facebook')
});

module.exports = router;
