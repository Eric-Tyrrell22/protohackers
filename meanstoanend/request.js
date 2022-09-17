const clients = require('./clients.js');

class Request {
  constructor( buffer, client_id ) {
    this.client_id = client_id;
    this.type = String.fromCharCode( buffer[ 0 ] )
    if( !['I','Q'].includes( this.type ) ){
      console.log( this.type || 'undefined' )
    }
    this.first = buffer.slice( 1, 5 );
    this.second = buffer.slice( 5 );
  }

  handleRequest() {
    if( this.type === 'I' ) {
      return clients.insert({
        client_id: this.client_id,
        timestamp: this.first.readInt32BE(),
        val:       this.second.readInt32BE()
      });
    } else if ( this.type === 'Q' ) {
      return clients.query({
        client_id: this.client_id,
        min_time:  this.first.readInt32BE(),
        max_time:  this.second.readInt32BE()
      });
    }
  }
}

module.exports = Request;
