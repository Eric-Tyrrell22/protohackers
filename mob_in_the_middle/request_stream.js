const { Transform } = require('stream');

const stream = () => {
  return new Transform({
    transform( chunk, _, callback ) {
      this.data ||= '';
      this.data += String( chunk );

      let newline_idx = this.data.indexOf('\n');
      while( newline_idx !== -1 ) {
        let line = this.data.slice(0, newline_idx ).toString();
        this.push( line );
        this.data = this.data.slice( newline_idx + 1 );
        newline_idx = this.data.indexOf('\n');
      }

      callback();
    }
  });
};

module.exports = stream;
