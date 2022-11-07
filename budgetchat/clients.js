const EventEmitter = require('events');
const request_stream = require('./request_stream.js');

class Client extends EventEmitter {
  constructor( connection ) {
    super()
    this.id = Math.floor(Math.random() * 1_500_000);
    this._raw_connection = connection;
    this.connection = this._raw_connection.pipe( request_stream() );

    // I spent about an extra 2 hours on this because I had
    // connection.on instead of this.connection.on...
    this.connection.on( 'data', ( chunk ) => {
      this.message( chunk.toString() );
    });

    this.connection.on( 'close', () => {
      this.disconnect();
    });
  }

  disconnect() {
    this.emit( 'disconnect' );
  }

  message( msg ) {
    this.emit( 'message', msg.replace( /\n$/, '' ));
  }

  send_message( msg ) {
    if( this.name ) {
      this._raw_connection.write( msg + "\n");
    }
  }

  set_name( name ) {
    if( !/^[a-zA-Z0-9]+$/.test( name ) ) {
      this._raw_connection.destroy();
      return;
    }
    this.name = name;
  }
}

module.exports = Client;
