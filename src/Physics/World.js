import Collisions from "./Collisions.js";
import Terrain from "./Terrain.js";

class World{
  constructor(){
    this.entities = [];
    this.tickingEntities = [];
    this.terrain = new Terrain();
    this.listeners = [];
  }

  addEventListener(listener){
    this.listeners.push(listener);
  }

  addEntity(entity){
    this.entities.push(entity);
    if(entity.needsTick){
      this.tickingEntities.push(entity);
    }
    for(let listener of this.listeners){
      listener.onEvent("Entity Added", entity);
    }
  }

  /**
  * @peram timestep the part of one second passed
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
}

export default World;
