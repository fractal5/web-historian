var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Q = require('q');

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

exports.send404 = function(response) {
  exports.sendResponse(response, "Not Found", 404);
};

// asset: last part of client path
// Refactored serveAssets to handle checking archives for data,
// but not yet being called to handle anything outside the public folder.
exports.serveAssets = function(res, asset, statusCode, callback) {

  // if present in public folder, return data
  // else 
  //    check to see if it's in the archives list
  //    if yes
  //      if in archive folder, return data
  //      else, not yet retrieved -> 302 -> loading.html
  //    else
  //      404

  statusCode = statusCode || 200;

  // Full fs path 
  var fullPath = path.join(archive.paths.siteAssets, asset);

  // Check if the requested file is in the public folder
  fs.readFile(fullPath, function(err, data) {
    if (!err) {
      // File in public folder, return it.
      exports.sendResponse(res, data.toString(), statusCode);
    } else {
      // Check if the file is in the archives list.
      archive.isUrlArchived(asset, function(isArchived) {
        if (isArchived) {
          // Present in the archive, so return the data to the user.
          archive.readArchiveFile(asset, function (err, data) {
            exports.sendResponse(res, data.toString(), statusCode);
          });
        } else {
          // Not present in archive, so 404.
          exports.send404(res);
        }
      });
    }
  });
};


//
// XXX: First stab at promise-ifying. Ugly.
//
exports.serveAssetsQ = function(res, asset, statusCode, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  statusCode = statusCode || 200;

  // Full fs path 
  var fullPath = path.join(archive.paths.siteAssets, asset);

  // get a promise-ified version of the function 
  var readFile = Q.denodeify(fs.readFile);

  readFile(fullpath)
    .then(function(err, data) {
      exports.sendResponse(res, data.toString(), statusCode);
    })
    .catch(function(err) {
      // File not in public folder; check archives folder 
      archive.isUrlArchived(asset, function(isArchived) {
        if (isArchived) {
          // Present in the archive, so return the data to the user.
          archive.readArchiveFileQ(asset)
            .then(function(data) {
              exports.sendResponse(res, data.toString(), statusCode);
            })
            .catch(function(err) {
              // TODO? handle err here?
            });
        } else {
          exports.send404(res);
        }
      });

    });

};

// As you progress, keep thinking about what helper functions you can put here!
