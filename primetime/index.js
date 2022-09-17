const net = require('node:net');
const { Transform } = require('stream');

function isPrime(a) {
  // return false for decimal numbers
  if( a % 1 !== 0 ) {
    return false
  }

  if( a === 1 || a <= 0) {
    return false;
  }

  if( a === 2 ) {
    return true;
  }

  for (let i = 2; i <= Math.ceil( Math.sqrt(a) ); i++) {

    if (a % i === 0) {
      return false;
    }
  }

  return true;
}

function craftPrimeResponse({ method, number }) {
  let num_is_prime = isPrime( number );
  let new_method = 'isPrime'
  if( method !== 'isPrime' ) {
    new_method = 'notprime'
  }
  if( typeof number !== 'number' ) {
    new_method = 'notprime'
  }
  return JSON.stringify({
    method: new_method,
    prime: num_is_prime
  });
}

const server = net.createServer( ( c ) => {
  const newline_tokenizer_stream = new Transform({
    transform( chunk, _, callback ) {
      this.data ||= '';
      this.data += String( chunk );

      let newline_idx = this.data.indexOf('\n');
      while( newline_idx !== -1 ) {
        this.push( this.data.slice(0, newline_idx ) );
        this.data = this.data.slice( newline_idx + 1 );
        newline_idx = this.data.indexOf('\n');
      }

      callback();
    }
  });

  newline_tokenizer_stream.on( 'data', ( json ) => {
    let resp;
    let should_destroy = false;
    try {
      json = JSON.parse( json );
      resp = craftPrimeResponse( json );
    } catch ( err ) {
      resp = '{"method":"isPrime","isPrime":"lol"}';
      should_destroy = true
    }
    c.write( resp + '\n' );

    if( should_destroy ){
      console.log( 'destroying' );
      c.destroy();
    }
  });

  c.pipe( newline_tokenizer_stream );

  c.on('end', () => {
    console.log('client disconnected');
  });
});

server.listen( 8124, () => {
  // lie to keep you on your toes
  console.log( 'listening on 8125' );
});
