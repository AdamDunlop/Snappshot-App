var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

// BASE SETUP
// ==============================================
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, '..', 'public');
var authRouter = require('./routers/auth.js');
var reqInfoLogger = function (req, res, next) {
   console.log(req.method, req.url);
  next();
}
// We point to our static assets
app.use(express.static(publicPath));
// We log every info requests
app.use(reqInfoLogger);
// We set the authenticated routes
app.use('/', authRouter);

// DATASTORE SETUP
// ==============================================
// connect to database
var url = 'mongodb://localhost:27017/Snappshot-test';
MongoClient.connect(url, function(err, db) {
	if(err) console.log('Error while connecting to the mongo database');  
	else console.log("Connected to Mongo database");
  db.close();
});

// FILES TRANSPILING, BUNDLING AND COMPILING
if(!isProduction) {
	// We require the bundler inside the if block because
  // it is only needed in a development environment
  var bundle = require('./bundler/bundle.js');
  bundle(startServer);
}

// START THE SERVER
// ==============================================
function startServer () {
	app.listen(port, function () {
	  console.log('running server on port ' + port);
	});
}
