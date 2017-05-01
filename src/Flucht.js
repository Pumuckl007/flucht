import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";
import PacketManager from "./PacketManager.js";
import PacketTypes from "./PacketTypes.js";

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
    this.READY = "ready";
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
      self.runner.pos = data.spawn;
      self.renderer.onEvent("Level Loaded", data.background);
      if(self.world.entities.length < 1){
        self.world.addEntity(self.runner, false);
      }
    }}, this.seed);
    this.runner = new Runner(64, 108, 0, 76);
    this.renderer = new Renderer(this.runner);
    this.world.addEventListener(this.renderer);
    this.world.addEntity(this.runner);
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
    this.renderer.render();
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
