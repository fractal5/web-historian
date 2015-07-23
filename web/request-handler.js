var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var urlParser = require('url');
// require more modules/folders here!

var acceptedPaths = {
  '/': true,
  '/styles.css': true
}

// do stuff to handle the request
// if url is present in archive folder, we've already
// crawled the URL -- return the webpage to the user.
// else, 
//  if !in text file, add to file to initiate crawling.
//  return loading.html to user.
var handleFormRequest = function(url, res) {

  archive.isUrlArchived(url, function(exists) {
    if (exists) {
      console.log("handleFormRequest for " + url + " in archive.");
      archive.readArchiveFile(url, function(data) {
        helper.sendResponse(res, data, 200);
      });
    } else {
      archive.isUrlInList(url, function(urlInList) {
        if (!urlInList) {
          archive.addUrlToList(url);
        }
      });

      helper.serveAssets(res, "loading.html", 302);
    }
  });
};

exports.handleRequest = function (req, res) {
  //res.end(archive.paths.list);
  var parts = urlParser.parse(req.url);
  console.log("handleRequest url: " + req.url + " parts: " + parts);

  if (acceptedPaths[parts.pathname]) {
    if (req.url === "/") {
      if (req.method === 'GET') {
        helper.serveAssets(res, "index.html");
      } else if (req.method === 'POST') {
        // This is a URL request through the form.
        var fullData = '';
        req.on('data', function(chunk) {
          // data looks like: url=www.google.com
          fullData += chunk.toString();
        });
        req.on('end', function() {
          handleFormRequest(fullData.slice(4), res);

        });

      }
    } else if (req.url === "/styles.css") {
      helper.serveAssets(res, "styles.css");
    }
  } else {
    helper.sendResponse(res, "Not Found", 404);
  }

};
