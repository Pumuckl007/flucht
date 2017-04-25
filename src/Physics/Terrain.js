import LevelGenerator from "./LevelGenerator.js";

/**
* A class representing all of the terain.
*/
class Terrain{

  /**
  * creates a new terrain based on the url to the json discription and a handler function to call back to spawn the runner.
  * @constructor
  * @param {String} url the url which the json is located at
  * @param {Function} handler the object which has a spawn runner method that will be called once the elements are loaded
  */
  constructor(url, handler, seed = Date.now()){
    this.handler = handler;
    this.spawn = {x: 0, y:100};
    this.elements = [];
    let self = this;
    let seedFunction = new Math.seedrandom(seed);
    this.handler = handler;
    LevelGenerator(url, function(elements, rooms){self.loadElements(elements, rooms)}, seedFunction);
  }

  /**
  * callback used internally, elements are rooms are returned from the level gernerator. Calls the handler's spawn runner.
  * @param {Element[]} elements the elements that were generated
  * @param {Room[]} rooms the rooms that were generated
  */
  loadElements(elements, rooms){
    this.elements = elements;
    this.rooms = rooms;
    this.handler.spawnRunner(this)
  }
}

export default Terrain;
