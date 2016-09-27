import Runner from "./Physics/Runner.js";
import World from "./Physics/World.js";
import Renderer from "./Renderer.js";

class Flucht{
  constructor(){
    this.world = new World();
    this.runner = new Runner(64, 128, 0, 76);
    this.renderer = new Renderer(this.runner);
    this.world.addEventListener(this.renderer);
    this.world.addEntity(this.runner);
  }

  render(){
    this.renderer.render();
  }

  update(){
    this.world.tick(20/1000);
  }
}

export default Flucht;
