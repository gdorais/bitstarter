// var express = require('express');
// var app = express.createServer(express.logger());
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
}).listen(9615);

// app.get('/', function(request, response) {
//  response.send('Hello World 2!');
// });
//app.get('/', function(request, response) {
//  response.send(index);
//});

//var port = process.env.PORT || 5000;
//app.listen(port, function() {
//  console.log("Listening on " + port);
//});

