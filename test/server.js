/**
 * FileName: server.js
 * Author: @mxfli
 * CreateTime: 2012-01-08 11:53
 * Description:
 *      Simple server for Tests.
 */

var connect = require('../node_modules/connect');
var fs = require('fs');
var path = require('path');
var zlib = require("zlib");


connect(
    connect.logger(':method :url - :res[content-type]', { buffer:5000 }),
    function (req, res, next) {
      req.filePath = path.join(__dirname, req.url);
      next();
    },
    function (request, response, next) {//static server
      if (request.filePath) {
        fs.stat(request.filePath, function (err, stats) {
          if (err) {
            next();
            return;
          }
          //response.setHeader('Content-Length', stats.size);

          var lastModified = stats.mtime.toUTCString();
          var ifModifiedSince = "If-Modified-Since".toLowerCase();
          response.setHeader("Last-Modified", lastModified);

          var expires = new Date();
          var maxAge = 3600 * 12 * 360 * 1000;
          expires.setTime(expires.getTime() + maxAge);
          response.setHeader("Expires", expires.toUTCString());
          response.setHeader("Cache-Control", "max-age=" + maxAge);

          if (request.headers[ifModifiedSince] && lastModified === request.headers[ifModifiedSince]) {
            response.writeHead(304, "Not Modified");
            console.log('304 not modified.');
            response.end();
          } else {
            var compressHandle = function (raw, statusCode, reasonPhrase) {
              var stream = raw;
              var acceptEncoding = request.headers['accept-encoding'] || "";
              var matched = true;//

              if (matched && acceptEncoding.match(/\bgzip\b/)) {
                response.setHeader("Content-Encoding", "gzip");
                stream = raw.pipe(zlib.createGzip());
              } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                response.setHeader("Content-Encoding", "deflate");
                stream = raw.pipe(zlib.createDeflate());
              }
              response.writeHead(statusCode, reasonPhrase);
              stream.pipe(response);
            };

            var raw;
            if (request.headers["range"]) {
              var range = utils.parseRange(request.headers["range"], stats.size);
              if (range) {
                response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                response.setHeader("Content-Length", (range.end - range.start + 1));
                raw = fs.createReadStream(request.filePath, {"start":range.start, "end":range.end});
                compressHandle(raw, 206, "Partial Content");
              } else {
                response.removeHeader("Content-Length");
                response.writeHead(416, "Request Range Not Satisfiable");
                response.end();
              }
            } else {
              raw = fs.createReadStream(request.filePath);
              compressHandle(raw, 200, "Ok");
            }
          }

        });

      } else {
        next();
      }
    },
    function (req, res) {
      console.error('url 404:', req.url);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('URI : "' + req.url + '" NOT found.');
    }
).listen(8080);