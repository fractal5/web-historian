// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

// Read the archives/sites/sites.txt file
// Use downloadURLS.

var crawlUrls = function() {
  archive.readListOfUrls(function(urlArray) {
    archive.downloadUrls(urlArray);
  });
};

crawlUrls();

