//Video streaming server - final
const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");
var indexPage;

fs.readFile("index.html", function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});

http.createServer(function (req, res) {
var reqResource = url.parse(req.url).pathname;
    //console.log("Resource: " + reqResource);
console.log(reqResource);

    if(reqResource == "/" || reqResource == "/index.html")
    {
        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    } else if (reqResource == "/favicon.ico"){
    
        res.writeHead(404);
        res.end();
    } 
    else /*if (reqResource=="/videos/movie1.mp4")*/
	  {
    console.log(reqResource);
    //var file = "./movie1.mp4";
    var file = "."+reqResource;
    fs.stat(file, function(err, stats) {
      //console.log(stats);
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.send("File is not found");
          //res.statusCode
        }
      res.end(err);
      }
    
    
      var range = req.headers.range;
      //range: bytes=0-1023
      //bytes=0-1023
      //0-1023
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }

      var positions = range.replace(/bytes=/, "").split("-");

      //"range: bytes=0-1023"
      var start = parseInt(positions[0]);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1]) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      //fs.createReadStream(file,{}).on("öpen").on()
      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
  }
}).listen(8000);