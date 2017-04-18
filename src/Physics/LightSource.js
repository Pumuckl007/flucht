/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {number} width the width of the light
  * @param {number} height the height of the light
  * @param {Object}  object Entity or element containing the position of the sprite
  * @param {boolean} moves true if the light needs to move to follow sprite
  */
  constructor(object, moving, sprite){
    this.follow = object;
    this.hasPhysics = moving; //calls update method
    this.sprite = sprite
    //this.pos = {x:this.follow.pos.x, y:this.follow.pos.y};
  }

  /**
  * update location of light
  * @param timestep the part of one second passed
  */
  update(timestep){
    //console.log("update");
    this.sprite.position.x = this.follow.pos.x - this.sprite.width/2;
    this.sprite.position.y = this.follow.pos.y - this.sprite.height/2;
  }
}

export default LightSource;
