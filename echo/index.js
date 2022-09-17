const net = require('node:net');

const server = net.createServer( ( c ) => {
  console.log( 'client connected' );
  c.pipe( c );
  c.on('end', () => {
    console.log('client disconnected');
  });
});

server.listen( 8124, () => {
  console.log( 'listening' );
});
