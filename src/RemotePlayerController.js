import PacketTypes from "./PacketTypes.js";
import Packet from "./Packet.js";
import RemoteRunner from "./Physics/RemoteRunner.js"

/**
* A class to controll the remote players
*/
class RemotePlayerController{
  /**
  * creates a new remote player controller
  * @constructor
  * @param {World} world the world to which to add the players
  */
  constructor(world, packetManager, runner){
    this.players = {};
    this.world = world;
    this.packetManager = packetManager;
    this.runner = runner;
    this.listeners = [];
    this.added = true;
    let self = this;
    this.world.addEventListener(this);
    window.remotePlayerController = this;
    this.packetManager.addListener(PacketTypes.runnerCreation, {onPacket:function(e){
      self.addPlayer(e.data);
    }});
    this.packetManager.addListener(PacketTypes.runnerUpdated, {onPacket:function(e){
      self.updatePlayer(e.data);
    }});
    this.update();
  }

  /**
  * creates a new player based on the event comming from the WebRTCConnection
  * @param {Object} playerCreationEvent the event fired for creation
  */
  addPlayer(playerCreationEvent){
    let x = playerCreationEvent.x;
    let y = playerCreationEvent.y;
    let remoteRunner = new RemoteRunner(64, 108, x, y);
    this.players[playerCreationEvent.playerId] = remoteRunner;
    this.world.addEntity(remoteRunner);
  }

  /**
  * called when the world sends an event
  */
  onEvent(type){
    if(type === "Reset"){
      this.added = false;
    }
    if(type === "Entity Added" && !this.added){
      this.added = true;
      for(let playerId in this.players){
        let player = this.players[playerId];
        this.world.addEntity(player);
      }
    }
  }

  /**
  * updates the remote players based on the events fired
  * @param {Object} playerUpdateEvent the update event
  */
  updatePlayer(playerUpdateEvent){
    let runner = this.players[playerUpdateEvent.playerId];
    runner.remoteUpdate(playerUpdateEvent.pos, playerUpdateEvent.vel, playerUpdateEvent.crouching, playerUpdateEvent.state, playerUpdateEvent.health);
  }

  /**
  * adds a remote player listenr of the given id
  * @param {String} id the id of the listener
  */
  addRemotePlayerListener(id){
    this.listeners.push(id);
    let data = {x: this.runner.pos.x, y:this.runner.pos.y, playerId:flucht.networkConnection.id};
    let packet = new Packet(false, id, PacketTypes.runnerCreation, data);
    this.packetManager.send(packet);
  }

  /**
  * sends and update to all listeners
  */
  update(){
    let self = this;
    window.setTimeout(function(){self.update()}, 100);
    if(!window.flucht){
      return;
    }
    let data = {pos: this.runner.pos,
       vel:this.runner.vel,
        crouching:keys[83],
         state:this.runner.state,
          playerId:flucht.networkConnection.id,
           health:flucht.runner.health};
    for(let listener of this.listeners) {
      let packet = new Packet(false, listener, PacketTypes.runnerUpdated, data);
      this.packetManager.send(packet);
    }
  }
}

export default RemotePlayerController;
