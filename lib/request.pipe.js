/**
 * FileName: request.pipe.js
 * Author: @mxfli
 * CreateTime: 2012-01-04 12:29
 * Description:
 *      Description of request.pipe.js
 *      use: muti-thread download/crawler/mini memory usage
 *      A request module that use pipe().pie() style codes, and router
 *      like connect depends on request urls and response headers.
 */

var http = require('http');
var globalAgent = http.globalAgent;
var url = require('url');
var path = require('path');
var zlib = require('zlib');
var util = require('util');
var logger = require('./logger.js');//.getLogger('debug');
var headers = require('./headers.js');
var statusCode = require('./statusCode.js');

var pipedRequest = function () {
  globalAgent.maxSockets = 1; //set maxSockets=2 in dev mod.
  //var reqType = ['link', 'js', 'css', 'image', 'ota/stream'];
  var routers = [];//{type:'in reqType',options:optons}

  var that = {};

  //every request is an cpmpleate session.
  that.get = function (options, callback) {
    logger.log('debug', 'request Headers:\n', util.inspect(options.headers));
    headers.addDefaultHeaders(options);
    //TODO(Inaction) Add cookies support.
    logger.log('warn', 'Cookies is not stetted.');
    if (options.cookie) {
      headers.setHeader.call(options.headers, 'cookie', options.cookie.getString());
    }

    var clientRequest = http.get(options);
    clientRequest.on('error', function (err) {callback(err)});
    clientRequest.on('response', function (response) {
      response.pause();

      //read statusCode and headers do something.
      statusCode.doSomething(options, response, function () {
        logger.log('info', 'call statusCode module.');
        //next() function. Add next to router.
      });

      logger.log('info', 'response Headers:\n', util.inspect(response.headers, true, 3, true));

      console.assert(Array.isArray(routers) && routers.length > 0);
      var raw = response;

      if (response.headers['content-encoding'] === 'gzip') {
        raw = response.pipe(zlib.createGunzip());
      }

      routers.forEach(function (router, index) {
        logger.log('debug', 'Add router:', index);
        var _raw = router(options, response);
        _raw && (raw = raw.pipe(_raw));
      });

      response.resume();
    });
  };

  /**
   * Add router rules to request.pipe
   * @param router Router function whith three arguments.
   *        arg1: clientRequest options;
   *        arg2: clientResponse object;
   *        arg3: next router caller;
   *
   */
  that.addRouter = function (router) {
    routers.push(router);
  };

  return that;
}();

module.exports = pipedRequest;
