var WSServer = require('websocket').server;

class WebsocketSever {
  constructor(httpServer){
    this.wsSever = new WSServer({
      httpServer: httpServer.server,
      autoAcceptConnections: false
    });
    this.wsSever.on('request', request => {
        this.onRequest(request, this);
    });
    this.handlers = {};
  }

  onRequest(request, self){
    if (!this.isOriginAllowed(request.origin)) {
      request.reject();
      return;
    }
    var connection = request.accept('webrtcmitigation', request.origin);
    connection.on('message', message => {
        if (message.type === 'utf8') {
          var msg = JSON.parse(message.utf8Data);
          msg.wsConnection = connection;
          this.emitEvent(msg.type, msg);
        }
    });
    connection.on('close', (reasonCode, description) => {
      console.log(connection.id + "Disconnected");
      this.emitEvent("disconnect", {id: connection.id});
    });
  }

  isOriginAllowed(origin){
    return true;
  }

  registerHandler(key, handler){
    if(this.handlers[key]){
      this.handlers[key].push(handler);
    } else {
      this.handlers[key] = [handler];
    }
  }

  emitEvent(key, msg){
    if(this.handlers[key]){
      for(let handler of this.handlers[key]){
        handler.onWebsocketMessage(key, msg);
      }
    }
  }
}

export default WebsocketSever;
