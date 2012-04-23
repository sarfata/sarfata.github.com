var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require('url');

var port = 80;

if (process.argv.length > 2) {
  port = process.argv[2];
}

http.createServer(function (req, res) {
  console.time('request');
  var path = url.parse(req.url).path;
  
  console.log("Requested path: %s", path);
  
  if (path == "/") {
    path = "/index.html";
  }
  
  var contentType = "html";
  
  if (path.match(/.png$/)) {
    contentType = "image/png";
  }
  if (path.match(/.css$/)) {
    contentType = "text/css";
  }
  
  path = path.replace("/", "");
  
  console.log('Reading %s', path);
  fs.readFile(path, function(err, data) {
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
