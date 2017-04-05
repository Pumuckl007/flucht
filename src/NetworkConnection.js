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
    console.log(event);
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
    this.pendingConnections[userId] = new WebRTCConnection(false, "dataTo" + userId, (event) => {
      if(event.type === "offer"){
        this.websocket.send(JSON.stringify({
          type:"offer",
          to:userId,
          from:this.id,
          offer: event.offer
        }));
      } else if(event.type === "ice"){
        this.websocket.send(JSON.stringify({
          type:"ice",
          to:userId,
          from:this.id,
          ice: event.ice
        }))
      } else if(event.type === "channelOpen"){
        this.webRTCConnections[userId] = this.pendingConnections[userId];
        this.pendingConnections[userId] = null;
      }
    });
  }

  acceptConnection(user, offer){
    console.log(user);
    if(this.pendingConnections[user.id]){
      console.warn("Already making a connection to this user!");
    }
    this.pendingConnections[user.id] = new WebRTCConnection(offer, "dataTo" + user.id, (event) => {
      if(event.type === "answer"){
        this.websocket.send(JSON.stringify({
          type:"answer",
          to:user.id,
          from: this.id,
          answer: event.answer
        }))
      } else if(event.type === "channelOpen"){
        this.webRTCConnections[user.id] = this.pendingConnections[user.id];
        this.pendingConnections[user.id] = null;
      }
    });
  }

  finishConnection(user, answer){
    if(!this.pendingConnections[user.id]){
      console.warn("Trying to finish a nonexistent connection!");
      return;
    }
    this.pendingConnections[user.id].setRemoteDescription(answer);
  }

  tryIce(user, ice){
    if(!this.pendingConnections[user.id]){
      console.warn("Requested to try ice even though connection is alredy made!");
      return;
    }
    this.pendingConnections[user.id].connection.addIceCandidate(ice);
    console.log("ice");
  }
}

export default NetworkConnection;
