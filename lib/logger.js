/**
 * FileName: logger.js
 * Author: @mxfli
 * CreateTime: 2012-01-10 19:52
 * Description:
 *      Simple logger for nodejs.
 */

var levels = ["FATAL", "ERROR", "WARN", "INFO", "DEBUG"];

if (levels.indexOf(process.env['LOG_LEVEL']) === -1) {
  console.error('ERROR : ', 'Your value:', process.env['LOG_LEVEL'], " accepted LOG_LEVEL values: ", levels.join(';'));
  throw new Error('Available process.env["LOG_LEVEL"] value.');
}

var LOG_LEVEL = process.env['LOG_LEVEL'] || levels[3]; //DEFAULT level is 1:INFO;
var levelLogger = {
  "FATAL":console.error.bind(null, 'FATAL :'),
  "ERROR":console.error.bind(null, 'ERROR :'),
  "WARN":console.warn.bind(null, 'WARN  :'),
  "INFO":console.log.bind(null, 'INFO  :'),
  "DEBUG":console.log.bind(null, 'DEBUG :')
};

/**
 * real log function;
 * this value for log level: this.level
 */
var log = function () {
  switch (arguments.length) {
    case 0:
      levels[this.level] >= 3 && console.log();
      break;
    default:
      var level = LOG_LEVEL;
      var arg0 = arguments[0];
      var sliceIndex = 0;
      if (typeof arg0 === 'string') {
        arg0 = arg0.trim().toUpperCase();
        if (levels.indexOf(arg0) !== -1) {
          sliceIndex = 1;
          level = arg0;
        }
      }
      if (levels.indexOf(this.level) >= levels.indexOf(level)) {
        levelLogger[level].apply(null, Array.prototype.slice.call(arguments, sliceIndex));
      }
  }
};

var logger = exports;

/**
 * process level log
 * set log level use process.env['LOG_LEVEL'], default is level:INFO
 */
logger.log = function () { log.apply({level:LOG_LEVEL}, arguments)};

/**
 * Custom level for debug is usfule.
 * @param level Custom level bind to the logger.default is process.env['LOG_LEVEL']
 */
logger.getLogger = function (level) {
  console.assert(typeof level === 'string');
  level = level.trim().toUpperCase();
  console.assert(levels.indexOf(level) !== -1);
  level = level || LOG_LEVEL;
  return {log:log.bind({level:level})};
};