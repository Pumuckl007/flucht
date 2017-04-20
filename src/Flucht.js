import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";
import PacketManager from "./PacketManager.js";

/** class creates world, runner and renderer to begin the game*/
class Flucht{
  /**
  * creates the world, renderer and player  assigns event listeners to world class
  * @constructor
  */
  constructor(){
    let self = this;
    this.seed = "Saya-" + Date.now();
    Math.seedrandom(this.seed);
    this.world = new World({spawnRunner:function(data){
      self.runner.pos = data.spawn;
      self.renderer.onEvent("Level Loaded", data.background);
    }});
    this.runner = new Runner(64, 108, 0, 76);
    this.renderer = new Renderer(this.runner);
    this.packetManager = new PacketManager();
    this.world.addEventListener(this.renderer);
    this.world.addEntity(this.runner);
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
    this.world.tick(20/1000);
  }
}

export default Flucht;
