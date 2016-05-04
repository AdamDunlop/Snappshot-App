var express = require('express');
var path = require('path');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

// We point to our static assets
app.use(express.static(publicPath));

if(!isProduction) {
	// We require the bundler inside the if block because
  // it is only needed in a development environment
  var bundle = require('./bundler/bundle.js');
  bundle(startServer);
}

function startServer () {
	// And run the server
	app.listen(port, function () {
	  console.log('running server on port ' + port);
	});

	app.get('/', function (req, res) {
		res.send(publicPath);
	});
}
