import WebRTCConnection from "./WebRTCConnection.js";

/** A class represending all the network connections of the client.
This has the following, A websocket to comunicate with the server,
and an array of webrtc connections that are being made or have been made */
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

  /**
  * handles a websocket message with the even given by the socket
  * @param event the event from the websocket
  */
  onWSMessage(event){
    let message = JSON.parse(event.data);
    console.log(event);
    this.emitEvent(message.type, message);
  }

  /**
  * handles a websocket event of type open
  * @param event the event from the websocket
  */
  onWSOpen(event){
    this.websocket.send(JSON.stringify({
      type:"id",
      name:this.name,
      id: this.id
    }));
  }

  /**
  * Adds a listener for the following even that comes from the network connection, this may be a websocket message or a
  connection that was established.
  * This will call the onWSMessage function
  * @param key the string key which to use
  * @param handler a method to call
  */
  registerHandler(key, handler){
    if(this.handlers[key]){
      this.handlers[key].push(handler);
    } else {
      this.handlers[key] = [handler];
    }
  }

  /**
  * private method used to dispatsh an event to the listenres
  * @param key the string key which to use
  * @param msg the object to emit
  */
  emitEvent(key, msg){
    if(this.handlers[key]){
      for(let handler of this.handlers[key]){
        handler.onWSMessage(key, msg);
      }
    }
  }

  /**
  * starts the connection to a user of the following id, it creates an offer and registers the handlers
  * to the webrtc connection to mitigate the offer, ice, and channelOpen events.
  * @param userId the id of the user to connect to
  */
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
        this.emitEvent("connectionEstablished", userId);
        this.webRTCConnections[userId] = this.pendingConnections[userId];
        this.pendingConnections[userId] = null;
      }
    });
  }

  /**
  * same as {@link connect} however takes a user object and accepts the provided offer.
  * @param user the user object to accept the connection of
  * @param offer the offer to use to accept the connection
  */
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
        this.emitEvent("connectionEstablished", user.id);
        this.webRTCConnections[user.id] = this.pendingConnections[user.id];
        this.pendingConnections[user.id] = null;
      }
    });
  }

  /**
  * does the last step in the webrtc mitigation, that is accepting the peers response.
  * @param user the user object coorisponding to the connection
  * @param answer the answer object to use
  */
  finishConnection(user, answer){
    if(!this.pendingConnections[user.id]){
      console.warn("Trying to finish a nonexistent connection!");
      return;
    }
    this.pendingConnections[user.id].setRemoteDescription(answer);
  }

  /**
  * trys an ice candidate for the webrtc connection.
  * @param user the user to try the ice for
  * @param ice the ice to use.
  */
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
