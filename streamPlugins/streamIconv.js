/**
 * FileName: streamIconv.js
 * Author: @mxfli
 * CreateTime: 2011-12-17 20:48
 * Description:
 *      Stream ICONV convert for node.
 *      node-iconv have Stream module whith a stream branch, but not released.
 */
var Stream = require('stream').Stream;
var util = require('util');
var Iconv = require('iconv').Iconv;
var logger = require('../lib/logger.js');//.getLogger('DEBUG');

function StreamIconv(convert) {
  Stream.call(this);
  this.convert = function (chunk) {return convert(chunk)};
  this.readable = true;
  this.writable = true;
  this.buffers = [];
  this.length = 0;
  this.needChangeCharset = true;
}
util.inherits(StreamIconv, Stream);

StreamIconv.prototype.write = function (data) {
  //GBK first char:0x81~0xFE; second char:0x40~0xFE
  //TODO(Inaction) less memory useage mode,add real stream convert.
  this.buffers.push(data);
  this.length += data.length;
  logger.debug('Total data lenth:', this.length);
};

StreamIconv.prototype.end = function () {
  //这样一次性转换性能好些，但内存消耗可能会比较多。
  var buffer = new Buffer(this.length);
  var index = 0;
  this.buffers.forEach(function (chunk) {
    chunk.copy(buffer, index);
    index += chunk.length
  });

  //Send data to write stream at once.
  this.emit('data', this.convert(buffer));
  this.emit('end');
};

exports.createIconvStream = function (inputEncoding, outputEncoding) {
  logger.info('Create Iconv Stream.', inputEncoding, 'to', outputEncoding);
  var iconv = new Iconv(inputEncoding, outputEncoding + '//IGNORE');
  return new StreamIconv(iconv.convert.bind(iconv));
};
