var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

// asset: last part of client path
exports.serveAssets = function(res, asset, statusCode, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  statusCode = statusCode || 200;

  // Full fs path 
  var fullPath = path.join(archive.paths.siteAssets, asset);

  fs.readFile(fullPath, function(err, data) {
    // TODO? handle err
    exports.sendResponse(res, data.toString(), statusCode);
  });
};



// As you progress, keep thinking about what helper functions you can put here!
