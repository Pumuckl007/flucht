/**
* a class representitive of a packet, with id, sender, receiver, and data
*/
class Packet{
  /**
  * creates a new packet with the given sender, reciever, id, and data
  * @constructor
  * @param {String} senderId the id of the sender
  * @param {String} recieverId the id of the receiver
  * @param {String} id the id of packet
  * @param {Object} data the data for the packet
  */
  constructor(senderId, recieverId, id, data){
    if(!senderId){
      senderId = networkConnection.id;
    }
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.id = id;
    this.data = data;
  }
}

export default Packet;
