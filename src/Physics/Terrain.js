import LevelGenerator from "./LevelGenerator.js";
import BearTrap from "./Elements/BearTrap.js";

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
    this.elements = [];
    this.rooms = [];
    let self = this;
    let seedFunction = new Math.seedrandom(seed);
    LevelGenerator(url, function(elements, rooms, spawns){self.loadElements(elements, rooms, spawns)}, seedFunction);
  }

  /**
  * callback used internally, elements are rooms are returned from the level gernerator. Calls the handler's spawn runner.
  * @param {Element[]} elements the elements that were generated
  * @param {Room[]} rooms the rooms that were generated
  */
  loadElements(elements, rooms, spawns){
    this.elements = elements;
    this.rooms = rooms;
    this.spawns = spawns;
    this.handler.spawnRunner(this)
  }

  /**
  * returns a unique id for this terrain
  */
  checksum(){
    let total = 0;
    for(let room of this.rooms){
      total += (room.x + room.y)*room.elements.length;
    }
    return total;
  }
}

export default Terrain;
