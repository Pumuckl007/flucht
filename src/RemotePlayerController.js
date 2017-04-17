import PacketTypes from "./PacketTypes.js";

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
  * updates the remote players based on the events fired
  * @param {Object} playerUpdateEvent the update event
  */
  updatePlayer(playerUpdateEvent){
    let runner = this.players[playerUpdateEvent.playerId];
    runner.remoteUpdate(playerUpdateEvent.pos, playerUpdateEvent.vel, playerUpdateEvent.crouching);
  }

  /**
  * adds a remote player listenr of the given id
  * @param {String} id the id of the listener
  */
  addRemotePlayerListener(id){
    this.listeners.push(id);
    let data = {x: this.runner.pos.x, y:this.runner.pos.y, playerId:networkConnection.id};
    let packet = new Packet(false, id, PacketTypes.runnerCreation, data);
    this.packetManager.send(packet);
  }

  /**
  * sends and update to all listeners
  */
  update(){
    let data = {pos: this.runner.pos, vel:this.runner.pos.y, crouching:keys[83], playerId:networkConnection.id};
    let packet = new Packet(false, id, PacketTypes.runnerUpdated, data);
    for(let listener : this.listeners){
      packet.recieverId = listener;
      this.packetManager.send(packet);
    }
  }
}
