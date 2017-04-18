/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {Object}  follow Entity or element containing the position of the sprite
  * @param {boolean} moving true if the light needs to move to follow sprite
  * @param {Sprite} sprite the light image that the Light Source moves
  */
  constructor(follow, moving, sprite){
    this.follow = follow;
    this.hasPhysics = moving; //calls update method
    this.sprite = sprite
    this.sprite.alpha = Math.random()/2+.5;
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
