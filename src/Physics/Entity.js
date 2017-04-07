import Box from "./Box.js";

/**
A class that is representitive of an entity, it has a position
width height, represented as a box, and a velocity as well as a type and state.
By default no physics are updated for this entity for needsTick and hasPhysics are
both false/
*/
class Entity{

  /**
  * creates an entity with the given width an height at zero zero, with zero velocity
  * @constructor
  * @param {number} width width of the entity
  * @param {number} height height of the entity
  */
  constructor(width = 1, height = 1){
    this.state = "idle";
    this.pos = {x:0, y:0}
    this.box = new Box(width, height);
    this.needsTick = false;
    this.hasPhysics = false;
    this.vel = {x:0, y:0};
    this.type = "Entity";
  }

}

export default Entity;
