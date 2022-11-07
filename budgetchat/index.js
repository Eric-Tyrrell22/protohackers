const net = require('node:net');
const request_stream = require('./request_stream.js');
const ChatServer = require('./chat_server.js');

const chat_server = new ChatServer();
const options = {
  allowHalfOpen: false
}
const server = net.createServer( options, ( c ) => {
  chat_server.addClient( c );
});

server.listen( 7777, () => {
  console.log( 'listening on 8124' );
});
