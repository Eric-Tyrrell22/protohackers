const Client = require('./clients.js');

class ChatServer {
  constructor() {
    this.client_map = {};
  }

  addClient( connection ) {
    const client = new Client( connection );
    connection.write('Welcome to budgetchat! What shall I call you?\n');
    client.on( 'message', (message) => {
      if( client.name === undefined ) {
        client.set_name( message );
        if( !client.name ) {
          return
        }
        this.send_server_message({
          recipient: client,
          message: this.list_clients( client )
        });

        this.broadcast({
          sender: client,
          is_server_message: true,
          message: `${client.name} has entered the room`
        });
      } else {
        this.broadcast({
          sender: client,
          message
        });
      }
    });

    client.on( 'disconnect', () => {
      delete this.client_map[ client.id ]
      if( client.name ) {
        this.broadcast({
          is_server_message: true,
          message: `${client.name} has left the room.`
        });
      }
    });
    this.client_map[ client.id ] = client;
  }

  list_clients( client ) {
    let client_names = this.clients().map( curr => curr?.name ).filter( Boolean )
    client_names = client_names.filter( curr => {
      return curr !== client.name
    });
    return `The room contains: ${client_names.join(' ') }`;
  }

  clients() {
    return Object.values( this.client_map );
  }

  broadcast({ sender, message, is_server_message= false}) {
    const recipients = this.clients().filter( curr => {
      return curr?.id !== sender?.id;
    });

    debugger;
    recipients.forEach( recipient => {
      if( is_server_message ) {
        this.send_server_message({ recipient, message });
      } else {
        this.send_client_message({ sender, recipient, message });
      }
    });
  }

  send_server_message({ recipient, message }) {
    const msg = `* ${message}`

    recipient.send_message( msg );
  }

  send_client_message({ sender, recipient, message }) {
    const msg = `[${sender.name}] ${message}`;

    recipient.send_message( msg );
  }

}

module.exports = ChatServer;
