/**
 * FileName: statusCode.js
 * Author: @mxfli
 * CreateTime: 2012-01-08 11:19
 * Description:
 *      Parse response statuscode
 */
var logger = require('./logger.js');
var statusCode = exports;

statusCode.doSomething = function (request, response, next) {
  var code = response.statusCode;
  logger.log('debug', 'response statusCode:', code);

  if (code === 200) {
    next();
  } else if (code > 300 && code < 400) {
    throw new Error("Redirect is not implement." + code);
  } else {
    throw new Error('Wrong statusCode for request:' + code);
  }
};