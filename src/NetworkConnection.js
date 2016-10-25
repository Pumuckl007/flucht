import WebRTCConnection from "./WebRTCConnection.js";

class NetworkConnection{
  constructor(name = "Saya"){
    this.websocket = new WebSocket("ws://" + document.URL.replace("http://", ""), "webrtcmitigation");
    let self = this;
    this.websocket.onmessage = function(e){
      self.onWSMessage(e);
    }
    this.websocket.onopen = function(e){
      self.onWSOpen(e);
    }
    this.webRTCConnections = [];
    this.pendingConnections = {};
    this.name = name;
    this.id = name + "-" + Math.random();
    this.handlers = {};
  }

  onWSMessage(event){
    let message = JSON.parse(event.data);
    this.emitEvent(message.type, message);
  }

  onWSOpen(event){
    this.websocket.send(JSON.stringify({
      type:"id",
      name:this.name,
      id: this.id
    }));
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
        handler.onWSMessage(key, msg);
      }
    }
  }

  connect(userId){
    if(this.pendingConnections[userId]){
      console.warn("There is already a connection going!");
    }
    this.pendingConnections[userId] = new WebRTCConnection(false, this.id + userId, (event) => {
      if(event.type === "offer"){
        this.websocket.send(JSON.stringify({
          type:"offer",
          to:userId,
          from:this.id,
          offer: event.offer
        }));
      }
    });
  }
}

export default NetworkConnection;
