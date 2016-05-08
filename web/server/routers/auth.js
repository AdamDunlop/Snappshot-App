var express = require('express');
var router = express.Router();
var path = require('path');
var publicPath = path.resolve(__dirname, '../..', 'public');

// AUTH ROUTER MIDDLEWARE
router.use(function(req, res, next) {
	next();
});

// AUTHENTICATED ROUTES
// ==============================================
router.get('/', function (req, res) {
	res.send(publicPath);
});

// GET /Login
// router.get('/login', function(req, res) {
//   res.send('this is the login form');
// });

// POST /Login
router.post('login', function(req, res) {
  console.log('processing');
  res.send('processing the login form!');
});

module.exports = router;
