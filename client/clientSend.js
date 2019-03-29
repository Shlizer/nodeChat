// Client for sending once WS message

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080/');

let sender = null,
    service = process.argv[2] || undefined,
    value = process.argv[3] || undefined;

if (service === undefined || value === undefined) {
  throw "No service or value given";
}

ws.on('open', function open() {
  console.log(new Date() + ' Connected...');
  console.log(new Date() + ' Service: '+service);
  console.log(new Date() + ' Value: '+value);

  ws.send(JSON.stringify({timestamp:Date.now(), service:service, value:value}));
  ws.close();

  console.log(new Date() + ' sended and disconnected...');
});