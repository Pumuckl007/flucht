import Packet from "./Packet.js";

/**
* a class to manager who gets which packet, information gets passed in packets over all forms of comuncation, a packet has a sender, recipient, id, and data objects as seen in packet.
*/
class PacketManager{

  /**
  * creates a new package manager
  * @constructor
  * @param {NetworkConnection} networkConnection the network connection to use
  */
  constructor(networkConnection){
    this.networkConnection = networkConnection;
    this.idMap = {};
  }

  /**
  * called on event from network connection.
  */
  onWSMessage(type, event){
    if(type === "webRTCMessage"){
      let packet = new Packet(event.userId, this.networkConnection.id, event.json.id, event.json.data);
      this.emitPacketEvent(packet);
    }
  }

  /**
  * adds a listener to the packet id
  * @param {String} id the id of the packet to listen to.
  * @param {Object} listener the listener
  * @param {Function} listener.onPacket the function called with the packet
  */
  addListener(id, listener){
    if(!this.idMap[id]){
      this.idMap[id] = [];
    }
    this.idMap[id].push(listener);
  }

  /**
  * emits a packet event to all of the listeners of the packets type.
  * @param {Packet} packet the packet to emit the events for
  */
  emitPacketEvent(packet){
    if(this.idMap[packet.id]){
      for(let listener of this.idMap[packet.id]){
        listener.onPacket(packet);
      }
    } else {
      console.log("Unhandled Packet", packet);
    }
  }

  /**
  * sends a packet
  * @param {Packet} packet the packet to send.
  */
  send(packet){
    let connection = this.networkConnection.webRTCConnections[packet.recieverId];
    if(connection){
      connection.channel.send(JSON.stringify({id : packet.id, data : packet.data}));
    }
  }

  /**
  * boradcasts a packet to all of the clients
  * @param {Packet} packet the packet to bradcast
  */
  broadcast(packet){
    for(let user in this.networkConnection.webRTCConnections){
      packet.recieverId = user;
      this.send(packet);
    }
  }
}


export default PacketManager;
