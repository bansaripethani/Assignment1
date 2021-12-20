


const WebSocket = require('ws');
const wss = new WebSocket.Server({  port: 8080 });

wss.on('connection', function(ws) {
  ws.send('Hello client')

  ws.on('message', function(message){
    console.log('client sent : Received message => ' + message);
    ws.send('Match Between : India Vs. England');
    ws.send('score: 130/4');
  }) 
})
