/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {Object}  follow Entity or element containing the position of the sprite
  * @param {boolean} moving true if the light needs to move to follow sprite
  * @param {Sprite} sprite the light image that the Light Source moves
  */
  constructor(follow, sprite, pulse){
    this.follow = follow;
    this.sprite = sprite;
    this.pulse = pulse;
    this.pulseValue = 0.005;

    //this.pos = {x:this.follow.pos.x, y:this.follow.pos.y};
  }

  /**
  * update location of light
  * @param timestep the part of one second passed
  */
  update(){
    //console.log("update");
    this.sprite.position.x = this.follow.pos.x - this.sprite.width/2;
    this.sprite.position.y = -this.follow.pos.y - this.sprite.height/2;
    if(this.pulse){
      if(this.sprite.alpha >= 1){
        this.pulseValue *= -1;
      }
      if(this.sprite.alpha <= 0.8){
        this.pulseValue *= -1;
      }
      this.sprite.alpha += this.pulseValue;
    }
  }
}

export default LightSource;
