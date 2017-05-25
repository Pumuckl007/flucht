/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {Object}  follow Entity or element containing the position of the sprite
  * @param {Sprite} sprite the light image that the Light Source moves
  * @param {boolean} pulse true if the light source is not a runner and light needs to pulse
  */
  constructor(follow, sprite, pulse){
    this.follow = follow;
    this.sprite = sprite;
    this.pulse = pulse;
    this.pulseValue = 0.005;
    this.offsetX = 0;
    this.offsetY = 0;
    //this.pos = {x:this.follow.pos.x, y:this.follow.pos.y};
  }

  // scale(scale){
  //   this.sprite.scale.x = this.sprite.scale.y = scale;
  //   //this.offsetX = -this.sprite.width * (1-scale);
  //   //console.log(this.sprite.position.x)
  // }

  /**
  * update location of light
  */
  update(){
    //console.log("update");
    this.sprite.position.x = this.follow.pos.x - this.sprite.width/2 + this.offsetX;
    this.sprite.position.y = -this.follow.pos.y - this.sprite.height/2 + this.offsetY;
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
