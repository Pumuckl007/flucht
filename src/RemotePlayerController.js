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
    this.packetManager.addListener(PacketTypes.murderDamage, {onPacket:function(e){
      self.hurt(e.data);
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
    let remoteRunner = new RemoteRunner(64, 108, x, y, playerCreationEvent.clientName);
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
  addRemotePlayerListener(id, name){
    this.listeners.push(id);
    let data = {x: this.runner.pos.x, y:this.runner.pos.y, playerId:flucht.networkConnection.id, clientName: name};
    let packet = new Packet(false, id, PacketTypes.runnerCreation, data);
    this.packetManager.send(packet);
  }

  /**
  * hurts this runner by the amount specified in the data
  * @param {Object} data the data
  * @param {Number} data.damage the damage dealt
  */
  hurt(data){
    if(data.damage){
      this.runner.hurt(data.damage);
    }
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
      crouching:this.runner.crouching,
      state:this.runner.state,
      playerId:flucht.networkConnection.id,
      health:flucht.runner.health};
    if(this.runner.frozen){
      data.vel.x = 0;
      data.vel.y = 0;
    }
    for(let listener of this.listeners) {
      let packet = new Packet(false, listener, PacketTypes.runnerUpdated, data);
      this.packetManager.send(packet);
    }
    for(let playerID in this.players){
      let runner = this.players[playerID];
      if(runner.healthDelta !== 0){
        let data = {
          damage: runner.healthDelta
        }
        let packet = new Packet(false, playerID, PacketTypes.murderDamage, data);
        this.packetManager.send(packet);
        runner.healthDelta = 0;
      }
    }
  }
}

export default RemotePlayerController;
