
import LevelGenerator from "./LevelGenerator.js";

class Terrain{
  constructor(url, handler){
    this.handler = handler;
    this.spawn = {x: 0, y:100};
    this.elements = [];
    let self = this;
    LevelGenerator(url, function(elements){self.loadElements(elements)});
  }

  loadElements(elements){
    this.elements = elements;
    this.handler.spawnRunner(this)
  }
}

export default Terrain;
