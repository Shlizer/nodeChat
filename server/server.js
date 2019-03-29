//https://www.npmjs.com/package/ws#usage-examples
//https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocketserver

const WebSocket = require('ws');

WebSocketService = function() {
  let service = this;
  service._server = null;

  /**
   * Get arguments of whole script
   * @returns {string[]}
   */
  service.args = process.argv.splice(2);

  /**
   * Log info if not in silent mode
   */
  service.log = function log() {
    if ( service.args.includes('--silent') || service.args.includes('-s') ) return;

    var logArguments = Array.prototype.slice.call(arguments);
    //logArguments.unshift(new Date());
    console.log(...logArguments);
  }

  service.start = function start() {
    service._server = new WebSocket.Server({
      port: 8080,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
      }
    });
    service._server.on('listening', function() {
      service.log('Server is listening on port 8080');
    });
    service._server.on('error', function(msg) {
      service.log('Server encountered error', msg);
    });
    service._server.broadcast = function broadcast(data) {
      service._server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };
    service._server.on('connection', function connection(ws, req) {
      const ip = req.connection.remoteAddress;
      //const ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
      service.log('Client connected on IP: '+ip);

      ws.on('message', function incoming(msg) {
        msg = JSON.parse(msg);
        service.log('received:', msg.timestamp, msg.service || '', msg.value || '');
        ws.send(JSON.stringify({timestamp:Date.now()}));
      });

      ws.on('close', function incoming(message) {
        service.log('Client disconnected');
      });
    });
  }
}

WSS = new WebSocketService;
WSS.start();