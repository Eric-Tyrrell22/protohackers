const net = require('node:net');
const request_stream = require('./request_stream.js');

const budget_chat_domain = 'chat.protohackers.com';
const budget_chat_port   = 16963;


function replace_boguscoin_address( str ) {
  const tony_address = '7YWHMfk9JZe0LM0g1ZauHuiSxhI';
  // not convinced this regex is correct at all
  const bogus_reg = /(^| )?(7[a-zA-Z0-9]{26,34})(\n|$| )/g
  console.log( str );
  const t = str.replaceAll( bogus_reg, `$1${tony_address}$3`);
  return t;
};

const server = net.createServer( ( c ) => {
  const budget_connection = net.createConnection({
    host: budget_chat_domain,
    port: budget_chat_port
  });

  const client = c.pipe( request_stream() );
  client.on( 'data', ( chunk ) => {
    const str = chunk.toString();
    const modified_chunk = replace_boguscoin_address( str );
    budget_connection.write( modified_chunk + '\n' );
  });

  client.on( 'close', () => {
    budget_connection.destroy();
  });

  budget_connection.on( 'data', ( chunk ) => {
    const str = chunk.toString();
    const modified_chunk = replace_boguscoin_address( str );
    c.write( modified_chunk );
  });
});
server.listen( 7777, () => {
  console.log( 'listening on 8124' );
});
