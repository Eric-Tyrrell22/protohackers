const net = require('node:net');
const request_stream = require('./request_stream.js');
const Request = require('./request.js');

const server = net.createServer( ( c ) => {
  const client_id = Math.floor(Math.random() * 15_000);
  const stream = request_stream();

  stream.on( 'data',  ( chunk ) => {
    const req = new Request( chunk, client_id );
    const resp = req.handleRequest();

    const resp_buffer = new Buffer( 4 );
    resp_buffer.writeInt32BE( resp )

    if( typeof resp  === 'number' ) {
      console.log( 'writing' );
      c.write( resp_buffer );
    }
  });

  c.pipe( stream );

  c.on('end', () => {
    console.log('client disconnected');
  });
});

server.listen( 8124, () => {
  console.log( 'listening on 8124' );
});
