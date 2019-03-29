const WebSocket = require('ws');

let sender = null,
    service = process.argv[2] || undefined,
    value = process.argv[3] || undefined;

let WebsocketClient = function () {
  let service = this;
  service.ws = new WebSocket('ws://localhost:8080/');

  service.open = function open() {
    console.log('connected');
    console.log('Service: '+service);
    console.log('Value: '+value);
    service.ws.send(JSON.stringify({timestamp:Date.now()}));
  }

  service.close = function close() {

  }

  service.message = function message() {

  }
}

ws.on('open', function open() {
  console.log('connected');
  console.log('Service: '+service);
  console.log('Value: '+value);
  ws.send(JSON.stringify({timestamp:Date.now()}));
});

ws.on('close', function close() {
  console.log('disconnected');
  clearTimeout(sender);
});

ws.on('message', function incoming(msg) {
  msg = JSON.parse(msg);
  console.log(`Roundtrip time: ${Date.now() - msg.timestamp} ms`);

  sender = setTimeout(function timeout() {
    ws.send(JSON.stringify({timestamp:Date.now()}));
  }, 1000);
});
