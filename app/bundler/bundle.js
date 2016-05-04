var Webpack = require('webpack');
var webpackConfig = require('../../webpack.config.js');
var path = require('path');

module.exports = function (cb) {
  // First we fire up Webpack an pass in the configuration we
  // created
  var compiler = Webpack(webpackConfig);

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.run(function(err, stats) {
    console.log( stats.toString({ colors: true }) );
    console.log( 'Bundling has finished.');
    cb();
  });
};