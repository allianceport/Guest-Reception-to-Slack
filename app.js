//npmを使ってインストールするモジュール
// johnny-five
// milkcocoa
// raspi-io
// request
// socket.io

var http = require("http");
var fs = require("fs");
var path = require("path");
var server = http.createServer(requestListener);
server.listen((process.env.PORT || 3000), function() {
    console.log((process.env.PORT || 3000) + "でサーバーが起動しました");
});

function requestListener(request, response) {
    var requestURL = request.url;
    var extensionName = path.extname(requestURL);
    switch(extensionName)
    {
        case ".html":
            readFileHandler(requestURL, "text/html", false, response);
            break;
        case ".css":
            readFileHandler(requestURL, "text/css", false, response);
            break;
        case ".js":
        case ".ts":
            readFileHandler(requestURL, "text/javascript", false, response);
            break;
        case ".png":
            readFileHandler(requestURL, "image/png", true, response);
            break;
        default:
            // どこにも該当しない場合は、index.htmlを読み込む
            readFileHandler("/index.html", "text/html", false, response);
            break;
    }
}
/**
 * ファイルの読み込み
 */
function readFileHandler(fileName, contentType, isBinary, response) {
    var encoding = !isBinary ? "utf8" : "binary";
    var filePath = __dirname + fileName;

    // fs.exists(filePath, function(exits) {
    //     if(exits)
    //     {
    //         fs.readFile(filePath, {encoding: encoding}, function (error, data) {
    //             if (error) {
    //                 response.statusCode = 500;
    //                 response.end("Internal Server Error");
    //             } else {
    //                 response.statusCode = 200;
    //                 response.setHeader("Content-Type", contentType);
    //                 if(!isBinary)
    //                 {
    //                     response.end(data);
    //                 }
    //                 else
    //                 {
    //                     response.end(data, "binary");
    //                 }
    //             }
    //         });
    //     }
    //     else
    //     {
    //         response.statusCode = 400;
    //         response.end("400 Error");
    //     }
    // });

    fs.open(filePath, 'ax+', 384 /*=0600*/, function(err, fd) {
      // if (err) {
      //   response.statusCode = 400;
      //   response.end("400 Error");
      // }
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

      fd && fs.close(fd, function(err) {
      });
    });
}

var settings = require("./settings.js")
var sentURL = settings.slackUrl;
var sentMilkcocoaURL = settings.milkcocoaUrl;
console.log("url "+sentURL);

var socketIO = require("socket.io");
var io = socketIO.listen(server);
io.sockets.on("connection", function (socket) {
  var request = require('request');
  function postToSlack(){

    var options = {
      url: sentURL,
      form: 'payload={"text": "'+ postText2 +'"}',
      json: true
    };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }else{
        console.log('error: '+ response.statusCode);
      }
    });
    socket.emit('dataName1', {hoge :  valueIndex});
    ds.push({v : postText});//milkcocoaにpush
  }

  var MilkCocoa = require('milkcocoa');
  var milkcocoa = new MilkCocoa(sentMilkcocoaURL);
  var ds = milkcocoa.dataStore('messages');
  var five = require("johnny-five");
  var Rasp = require("raspi-io");
  var board = new five.Board({
      io: new Rasp()
  });
  var flag = false;
  var flag2 = false;
  var valueIndex = 0;
  var postText = '';
  var postText2 = '';
  var count = 0;
  var count2 = 0;
  var now = "";
  board.on("ready", function() {
      this.pinMode(16, five.Pin.INPUT);
      this.digitalRead(16, function(value){
      valueIndex = value;
        if (value > 0) {
          count++;
          if(count==500){
            postText = 'open';
            postText2 = 'オフィスオープン';
            postToSlack();
            count2 = 0;
          }
        }
        if (value < 1) {
          count2++;
          if(count2==500){
            postText = 'close';
            postText2 = 'オフィスクローズ';
            postToSlack();
            count = 0;
          }
        }
        // console.log("v1",count);
        // console.log("v2",count2);
      });
  });
});
