var http = require('http');
var fs = require("fs");
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var output = fs.readFileSync("./index.html", "utf-8");
  res.end(output);
}).listen(8000);
