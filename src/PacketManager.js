
/**
* a class to manager who gets which packet, information gets passed in packets over all forms of comuncation, a packet has a sender, recipient, id, and data objects as seen in packet.
*/
class PacketManager{

  /**
  * creates a new package manager
  * @constructor
  */
  constructor(){
    this.idMap = {};
  }

  /**
  * called on event from network connection.
  */
  onWSMessage(type, event){
    if(type === "webRTCMessage"){
      let packet = new Packet(event.userId, networkConnection.id, event.json.id, event.json.data);
    }
  }

  /**
  * adds a listener to the packet id
  * @param {String} id the id of the packet to listen to.
  * @param {Object} listener the listener
  * @param {Function} listener.onPacket the function called with the packet
  */
  addListener(id, listener){
    if(!idMap[id]){
      idMap[id] = [];
    }
    idMap[id].push(listener);
  }

  /**
  * emits a packet event to all of the listeners of the packets type.
  * @param {Packet} packet the packet to emit the events for
  */
  emitPacketEvent(packet){
    if(idMap[packet.id]){
      for(let listener of idMap[packet.id]){
        listener.onPacket(packet);
      }
    }
  }

  /**
  * sends a packet
  * @param {Packet} packet the packet to send.
  */
  send(packet){
    let connection = networkConnection.connections[packet.recieverId];
    if(connection){
      connection.send(JSON.stringify({id : packet.senderId, data : packet.data}));
    }
  }
}


export default PacketManager;
