import Packet from "./../Packet.js";
import PacketTypes from "./../PacketTypes.js";

/**
* a class to sync the elements that need a network update
*/
class ElementNetworkSyncController{

  /**
  * creates a new EntityNetworkSyncController with the specified packet manager
  * @constructor
  * @param {PacketManager} packetManager the packet manager
  */
  constructor(packetManager, world){
    world.addEventListener(this);
    this.packetManager = packetManager;
    this.elements = [];
    for(let element of world.terrain.elements){
      if(element.id >= 0){
        this.elements[element.id] = element;
      }
    }
    let self = this;
    this.packetManager.addListener(PacketTypes.elementUpdate, {onPacket:function(e){
      self.onPacket(e.data);
    }});
  }



  /**
  * called when a packet is received
  * @param {Packet} packet the packet that was received
  */
  onPacket(packet){
    if(this.elements[packet.id]){
      this.elements[packet.id].accepetPacketData(packet .updateData);
    }
  }

  onEvent(event, element){
    if(event === "Element Added"){
      if(element.id >= 0){
        this.elements[element.id] = element;
      }
    }
  }

  /**
  * called periodically to check for an update in the world
  */
  update(){
    for(let entity of this.elements){
      if(entity && entity.hasChanged){
        let entityData = entity.generatePacketData();
        let packetData = {
          id:entity.id,
          updateData: entityData
        }
        let packet = new Packet(false, false, PacketTypes.elementUpdate, packetData);
        this.packetManager.broadcast(packet);
      }
    }
  }

}

export default ElementNetworkSyncController;
