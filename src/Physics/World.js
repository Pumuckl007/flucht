import Collisions from "./Collisions.js";
import Terrain from "./Terrain.js";

/**
* The class representing the entier world for physics purposes
*/
class World{

  /**
  * creates a new world that loads the level "/levels/Level1.json" and calls the spawn handler when done as specified in Terrain constructor.
  * @param {Object} spawnHandler the spawn handler to have spawn runner called on
  * @param {Function} spawnHandler.spawnRunner a method that should spawn a runner
  */
  constructor(spawnHandler, seed){
    this.entities = [];
    this.seed = seed;
    this.tickingEntities = [];
    this.terrain = new Terrain("/levels/Level1.json", spawnHandler, seed);
    this.spawnHandler = spawnHandler;
    this.listeners = [];
  }

  /**
  * adds the event listener to the pool of listeners
  * @param {Object} listener the listener
  * @param {Function} listener.onEvent the function called when an even occures, called with a string and an update object.
  */
  addEventListener(listener){
    this.listeners.push(listener);
  }

  /**
  * adds a new entity to the world
  * @param {Entity} entity the entity to add
  * @param {Boolean} notifyObservers whether or not to notify listeners
  */
  addEntity(entity){
    this.entities.push(entity);
    if(entity.needsTick){
      this.tickingEntities.push(entity);
    }
    for(let listener of this.listeners){
      listener.onEvent("Entity Added", entity);
      listener.onEvent("Terrain Updated", this.terrain);
    }
  }

  /**
  * called when a tick occures
  * @param timestep the part of one second passed
  */
  tick(timestep){
    for(let entity of this.tickingEntities){
      entity.tick();
    }
    for(let entity of this.entities){
      if(entity.hasPhysics){
        entity.update(timestep);
      }
      if(entity.worldCollisions){
        Collisions.terrainAndEntity(this.terrain, entity);
      }
    }
  }

  /**
  * resets the world
  * @param {String} seed the seed to use if blank uses prior seed
  */
  reset(seed){
    this.seed = seed;
    for(let listener of this.listeners){
      listener.onEvent("Reset");
    }
    this.entities = [window.flucht.runner];
    let self = this;
    this.terrain = new Terrain("/levels/Level1.json", {spawnRunner:function(data){
      for(let listener of self.listeners){
        listener.onEvent("Terrain Updated", self.terrain);
        self.spawnHandler.spawnRunner(data);
        listener.onEvent("Entity Added", window.flucht.runner);
      }
    }} , this.seed);
    for(let listener of this.listeners){
      // listener.onEvent("Terrain Updated", this.terrain);
      // for(let entity of this.terrain.elements){
      //   listener.onEvent("Entity Added", entity);
      // }
      // for (let entity of this.entities){
      //   listener.onEvent("Entity Added", entity);
      // }
    }
  }
}

export default World;
