import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";
import PacketManager from "./PacketManager.js";
import PacketTypes from "./PacketTypes.js";
import RemotePlayerController from "./RemotePlayerController.js";
import Packet from "./Packet.js";
import NetworkConnection from "./NetworkConnection.js";
import PartyWorld from "./PartyWorld.js";

/** class creates world, runner and renderer to begin the game*/
class Flucht{
  /**
  * creates the world, renderer and player  assigns event listeners to world class
  * @constructor
  */
  constructor(){
    this.seed = "Saya-" + Date.now();
    this.packetManager = new PacketManager();
    this.listeners = [];
    /**
    * the constant for the world created event
    */
    this.WORLDCREATED = "world created";

    this.networkConnection = new NetworkConnection();
    this.partyWorld = new PartyWorld(document.getElementById("Party Display"), this.networkConnection);
    this.networkConnection.registerHandler("leave", this.partyWorld);
    this.networkConnection.registerHandler("peers", this.partyWorld);
    this.networkConnection.registerHandler("join", this.partyWorld);
    this.networkConnection.registerHandler("offer", this.partyWorld);
    this.networkConnection.registerHandler("answer", this.partyWorld);
    this.networkConnection.registerHandler("ice", this.partyWorld);
    this.networkConnection.registerHandler("connectionEstablished", this.partyWorld);

    this.pm = new PacketManager();
    let test = function(e, v){ this.pm.onWSMessage(e, v)}
    this.networkConnection.registerHandler("webRTCMessage", {
      onWSMessage: test
    });
    this.pm.addListener(PacketTypes.seed, this.flucht);

  }

  /**
  * adds a listener to flucht
  */
  addEventListener(listener){
    this.listeners.push(listener);
  }

  /**
  * creates a new world based on the seed provided to flucht
  */
  createWorld(){
    let self = this;
    this.world = new World({spawnRunner:function(data){
      if(self.runner){
        self.runner.pos = data.spawn;
      } else {
        self.spawn = data.spawn;
      }
      self.renderer.onEvent("Terrain Updated", self.world.terrain);
      self.renderer.onEvent("Level Loaded", data.background);
      if(self.world.entities.length < 1 && self.runner){
        self.world.addEntity(self.runner, false);
      }
    }}, this.seed);
    this.renderer = new Renderer();
    this.world.addEventListener(this.renderer);
    for(listener in this.listeners){
      listener.onEvent(this.WORLDCREATED, this.world);
    }
  }

  /**
  * inserts the runner to the world
  */
  insertRunner(){
    if(this.spawn){
      this.runner = new Runner(64, 108, this.spawn.x, this.spawn.y);
    } else {
      this.runner = new Runner(64, 108, 0, 76);
    }
    this.renderer.addRunner(this.runner)
    this.world.addEntity(this.runner);
    this.remotePlayerController = new RemotePlayerController(this.world, this.pm, this.runner);
    let self = this;
    this.networkConnection.registerHandler("connectionEstablished", {onWSMessage:function(e, v){
      remotePlayerController.addRemotePlayerListener(v.id);
      if(v.offerer){
        self.pm.send(new Packet(false, v.id, PacketTypes.seed, {seed:self.seed}));
      }
    }});
  }

  /**
  * called when packet is recived
  * @param {Packet} packet the packet recived
  */
  onPacket(packet){
    if(packet.id === PacketTypes.seed){
      this.seed = packet.data.seed;
      this.world.reset(this.seed);
      this.runner.pos.x = 0;
      this.runner.pos.y = 76;
    }
  }

  /**
  * renderers all the elements in the stage
  */
  render(){
    if(this.renderer){
      this.renderer.render();
    }
  }

  /**
  * updates the world after 20 milliseconds
  */
  update(){
    if(this.world){
      this.world.tick(20/1000);
    }
  }
}

export default Flucht;
