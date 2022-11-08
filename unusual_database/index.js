const dgram = require( 'node:dgram');

const server = dgram.createSocket('udp4');

function splitInsert( msg ) {
  const idx = msg.indexOf('=');
  const key = msg.slice( 0, idx );
  const val = msg.slice( idx + 1);
  return { key, val };
}


const db = {};
function insert( msg ) {
  const { key, val } = splitInsert( msg );
  console.log({ key, val });
  db[ key ] = val;
}

function retrieve( msg ) {
  if ( msg === 'version' ) {
    return "version=Ken's Key-Value Store 1.0"
  }
  return `${ msg }=${ db[ msg ] }`
}

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
  msg = msg.toString()
  if( msg.includes("=") ) {
    console.log({ insert: msg });
    insert( msg );
  } else {
    const result = retrieve( msg );
    console.log({ result });
    server.send( result, rinfo.port, rinfo.address );
  }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(7777);
