var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpReq = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// Read archives/sites.txt
// Parse into array of URLs, which are passed to the callback.
exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, data) {
    var urls = data.toString().split('\n');
    callback(urls);
  });
};

// Is a given URL listed in archives/sites.txt?
exports.isUrlInList = function(){
};

// Append URL to archives/sites.txt
// Assumes that higher level caller checked to see if URL
// is already in list.
exports.addUrlToList = function(){
};

// Our crawling function has already retrieved and saved the URL.
// Present in archivedSites directory.
exports.isUrlArchived = function(url, callback){
  var fullPath = path.join(exports.paths.archivedSites, url);
  fs.exists(fullPath, function(exists) {
    callback(exists);
  });
};

// Read the given URL archive file and pass the stringified data
// back to the callback function.
exports.readArchiveFile = function(url, callback) {
  var fullPath = path.join(exports.paths.archivedSites, url);
  fs.readFile(fullPath, function(err, data) {
    callback(data.toString());
  });
};

// Q: Is this for the crawler? Y
// for each URL in the sites.txt
//    Use the HTTP lib to GET URL data
//    fs.writeFile the data to archives/sites dir.
exports.downloadUrls = function(urlArray) {
  console.log("downloadUrls");
  urlArray.forEach(function(url) {
    httpReq.get(url, function (err, res) {
      var htmlPage = res.buffer.toString();
      console.log("res: ", res.code, res.headers, res.buffer.toString());
      fs.writeFile(path.join(exports.paths.archivedSites, url), htmlPage);
    });
    
  });
};
