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
    this.terrain = new Terrain("levels/Level1.json", spawnHandler, seed);
    this.spawnHandler = spawnHandler;
    this.listeners = [];
    this.keyCollected = false;
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
  * adds a new entity to the world
  * @param {Entity} element the element to add
  */
  addElement(element){
    this.terrain.elements.push(element);
    for(let listener of this.listeners){
      listener.onEvent("Element Added", element)
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
  * retursn if the entity collides with the terrain
  * @param {Element} element the element to check against
  * @return {Boolean} whether or not the terrain collides with the element
  */
  doesTerrainCollide(element){
    return Collisions.terrainAndElement(this.terrain, element, true);
  }

  /**
  * resets the world
  * @param {String} seed the seed to use if blank uses prior seed
  */
  reset(seed){
    this.keyCollected = false;
    this.seed = seed;
    for(let listener of this.listeners){
      listener.onEvent("Reset");
    }
    this.entities = [];
    if(window.flucht.runner){
      this.entities.push(window.flucht.runner);
    }
    let self = this;
    this.terrain = new Terrain("levels/Level1.json", {spawnRunner:function(data){
      let first = true;
      for(let listener of self.listeners){
        listener.onEvent("Terrain Updated", self.terrain);
        if(first){
          self.spawnHandler.spawnRunner(data);
          first = false;
        }
        listener.onEvent("Entity Added", window.flucht.runner);
      }
    }} , this.seed);
  }

  /**
  * deals damage to all of the elements in the section
  * @param {Box} box the box to collide with
  * @param {Number} amount the amount of damage
  * @param {Entity} emitter the emitter to no do damage to
  */
  dealDamage(box, amount, emitter, x, y){
    let hits = Collisions.boxAndEntities(box, this.entities, x, y);
    for(let hit of hits){
      if(hit !== emitter && hit.hurt){
        hit.hurt(amount);
      }
    }
  }
}

export default World;
