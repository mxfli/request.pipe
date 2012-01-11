/**
 * FileName: headers.js
 * Author: @mxfli
 * CreateTime: 2012-01-03 23:43
 * Description:
 *     Parse request and response headers;
 */
var headers = exports;

headers.addDefaultHeaders = function (options) {
  options.headers = options.headers || {};
  options.headers['Accept-Charset'] = 'UTF-8,*;q=0.5';//from chrome
  options.headers['Accept-Encoding'] = 'gzip'; // accept gzip content-encoding
  options.headers['UserAgent'] = 'Request.pipe v0.0.1 node.js(' + process.version + ')';
};

//Call this by func.call(this, name, value)
headers.setHeader = function (name, value) {
  this[name] = value;
};

headers.parseHeaders = function (request, response) {
  //gzip
  //mutipart? 断点续传 后期再写
  //GBK to utf-8
  //SAVE to File
  //parse page:SAX
  //end this request.
};