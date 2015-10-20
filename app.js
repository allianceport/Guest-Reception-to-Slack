var http = require("http");
var fs = require("fs");
var path = require("path");
var server = http.createServer(requestListener);
server.listen((8000), function() {
    console.log((process.env.PORT || 8000));
});
function requestListener(request, response) {
    var requestURL = request.url;
    var extensionName = path.extname(requestURL);
    switch(extensionName)
    {
        case ".html":
            readFileHandler(requestURL, "text/html", false, response);
            break;
        case ".js":
            readFileHandler(requestURL, "text/javascript", false, response);
            break;
        case ".json":
            readFileHandler(requestURL, "text/json", false, response);
            break;
        default:
            readFileHandler("/index.html", "text/html", false, response);
            break;
    }
}

function readFileHandler(fileName, contentType, isBinary, response) {
    var encoding = !isBinary ? "utf8" : "binary";
    var filePath = __dirname + fileName;

    fs.exists(filePath, function(exits) {
        if(exits)
        {
            fs.readFile(filePath, {encoding: encoding}, function (error, data) {
                if (error) {
                    response.statusCode = 500;
                    response.end("Internal Server Error");
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", contentType);
                    if(!isBinary)
                    {
                        response.end(data);
                    }
                    else
                    {
                        response.end(data, "binary");
                    }
                }
            });
        }
        else
        {
            response.statusCode = 400;
            response.end("400 Error");
        }
    });
}
