var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";

// var routes = {
//   '/classes/messages': require('./request-handler').requestHandler
//   // ...
// };

var server = http.createServer(function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);
  handler.handleRequest(request, response);
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}

