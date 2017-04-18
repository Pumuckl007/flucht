import Entity from "./Entity.js";

/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource extends Entity{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {number} width the width of the light
  * @param {number} height the height of the light
  * @param {Object}  object Entity or element containing the position of the sprite
  * @param {boolean} moves true if the light needs to move to follow sprite
  */
  constructor(width, height, object, moving, sprite){
    super(width, height);
    this.follow = object;
    this.hasPhysics = moving; //calls update method
    this.needsTick = false; //calls tick method
    this.worldCollisions = false;
    this.type = "LightSource";
    this.sprite = sprite
    //this.pos = {x:this.follow.pos.x, y:this.follow.pos.y};
  }

  /**
  * update location of light
  * @param timestep the part of one second passed
  */
  update(timestep){
    this.sprite.position.x = this.follow.pos.x;
    this.sprite.position.y = this.follow.pos.y;
  }
}

export default LightSource;
