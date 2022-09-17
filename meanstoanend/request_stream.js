const { Transform } = require('stream');

const stream = () => { 
  return new Transform({
    transform( chunk, encoding, cb ) {
      this.data ||= Buffer.from('');
      this.data = Buffer.concat([ this.data, chunk ]);

      while ( Buffer.byteLength( this.data, encoding ) >= 9 ) {
        const slice = this.data.slice(0, 9 );
        this.push( Buffer.from( slice ) );
        this.data = this.data.slice( 9 );
      }

      cb()
    }
  });
}

module.exports = stream;
