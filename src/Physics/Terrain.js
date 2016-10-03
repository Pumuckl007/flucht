
import LevelGenerator from "./LevelGenerator.js";

class Terrain{
  constructor(url, handler){
    this.handler = handler;
    this.spawn = {x: 0, y:100};
    this.elements = [];
    let self = this;
    LevelGenerator(url, function(elements, rooms){self.loadElements(elements, rooms)});
  }

  loadElements(elements, rooms){
    this.elements = elements;
    this.rooms = rooms;
    this.handler.spawnRunner(this)
  }
}

export default Terrain;
