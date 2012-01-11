/**
 * FileName: requestTest.js
 * Author: @mxfli
 * CreateTime: 2012-01-08 12:45
 * Description:
 *      Description of requestTest.js
 */

//set console.log debug level.
process.env['LOG_LEVEL'] = 'INFO';

var url = require('url');
var path = require('path');
var fs = require('fs');
var request = require('../lib/request.pipe.js');
var logger = require('../lib/logger.js').getLogger('debug');
var streamIconv = require('../streamPlugins/streamIconv.js');

var uri = 'http://tech.163.com';
var urlObj = url.parse(uri);
urlObj.type = 'link';

request.addRouter(iconv);
request.addRouter(saveAs);

request.get(urlObj, function callback(err) {
  if (err) throw err;
  logger.log('info', 'call write stream from request');
  //Add SAX parseer stream for crawling.
});


function iconv(req, res) {
  if (/link|css|js/i.test(req.type)) {
    var regExp = /gbk|gb2312/i;
    var contentType = res.headers['content-type'];
    contentType = contentType || '';
    if ((regExp.test(req.siteCharset) || regExp.test(contentType)) && !/utf-8/i.test(contentType)) {
      logger.log('debug', 'iconv router matched and return iconv router.');
      return streamIconv.createIconvStream('GBK', 'UTF-8')
    } else {
      logger.log('debug', 'iconv router not matched.');
    }
  }
}

function saveAs(req, res) {
  var filePath = path.join(__dirname, url.parse(req.href).path);
  if (/\/$/.test(filePath)) {
    filePath = path.join(filePath, 'index.html');
    logger.log('debug', 'save request as file:', filePath)
  }
  return fs.createWriteStream(filePath);
}