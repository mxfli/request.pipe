# About request.pipe 
rquest.pipe is a piped chain request module for node.js

 *   You can use it like pipe(stream1).pipe(stream2).pipe(stream-X);
 *   Chaining stream for request and response
 *   connect style router pipes for request and response depends on request and response headers;

It`s here ...   now!...^_^

##Usage
1.   install module request.pipe: npm install request.pipe (not push tu npm repo);
2.   use bin/config.js enable desable exists plugins;
2.   write your own strem module or use exits stream module. see example:./streamPlugins/streamIconv.js
3.   add stream to routers by order. request.addRouter();
4.   usage example: ./test/requestTest.js

##TODO List
 *  Improve interface and fix bugs.
 *  Refactor and improve documents.