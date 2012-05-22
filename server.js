var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');
var path = require('path');

var port = 80;

if (process.argv.length > 2) {
  port = process.argv[2];
}

http.createServer(function (req, res) {
  console.time('request');
  var reqPath = url.parse(req.url).path;
  
  console.log("Requested path: %s", reqPath);
  
  if (reqPath == "/") {
    reqPath = "/index.html";
  }
  
  reqPath = path.join(path.dirname(__filename), path.normalize(reqPath))
  
  var contentType = "html";
  
  if (path.extname(reqPath) == ".png") {
    contentType = "image/png";
  }
  if (path.extname(reqPath) == ".css") {
    contentType = "text/css";
  }
  
  console.log('Reading %s', reqPath);
  fs.readFile(reqPath, function(err, data) {
    if (err) {
      res.writeHead(500);
      res.end(util.inspect(err));
    }
    else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }

  });
  console.timeEnd('request');
}).listen(port);

console.log("Server running on 127.0.0.1:" + port);
