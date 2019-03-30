//https://www.npmjs.com/package/ws#usage-examples
//https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocketserver

const WebSocket = require('ws');
const args = require('./args')(process);

/**
 * Server options
 */
const wsServerOptions = {
  port: args.port || 8080,
  perMessageDeflate: {
    zlibDeflateOptions: { // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: { chunkSize: 10 * 1024 },
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages should not be compressed.
  }
};

/**
 * WSServer options
 */
const defaultOptions = {
  startCallback: function start() {
    console.log('Server is listening on port 8080');
  },
  errorCallback: function error(msg) {
    console.log('Server encountered error', msg);
  },
  beforeBroadcastCallback: function beforeBroadcast(data, clients) { return true; },
  afterBroadcastCallback: function afterBroadcast(data, clients) { return true; },
  clientConnectedCallback: function clientConnected(client, request) { return true; },
  clientDisconnectedCallback: function clientDisconnectedConnect(client, request) { return true; },
}

/**
 * WebsocketServer service
 */
WebSocketServer = function (options) {
  let service = this;
  service._server = null;
  service.options = Object.assign({}, defaultOptions, options || {});

  service.start = function start() {
    service._server = new WebSocket.Server(wsServerOptions);
    // Server started
    service._server.on('listening', service.options.startCallback);

    // Server encountered error
    service._server.on('error', service.options.errorCallback);

    // Server is broadcasting data
    service._server.broadcast = function broadcast(data) {
      if (service.options.beforeBroadcastCallback(data, service._server.clients) === true) {
        service._server.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) client.send(data);
        });
      }
      service.options.afterBroadcastCallback(data, service._server.clients);
    };

    // Client connected
    service._server.on('connection', function connection(client, req) {
      console.log('Client connected on IP:', req.connection.remoteAddress);
      service.options.clientConnectedCallback(client, req);

      client.on('close', function close() {
        console.log('Client disconnected');
        service.options.clientDisconnectedCallback(client, req);
      });

      client.on('message', function message(msg) {
        msg = JSON.parse(msg);
        console.log('received:', msg.timestamp, msg.service || '', msg.value || '');
        client.send(JSON.stringify({ timestamp: Date.now() }));
      });
    });
  }
}

module.exports = WebSocketServer;