class AnimatedEntityRenderer{
  /**
  * Creates a AnimatedEntityRederer object that animates the player character
  * @param {Entity} entity the character that is to be animated
  * @param {String} url the location of the images of the character
  * @param {boolean} mirrorBasedOnVel the direction character faces based on their velocity 
  */
  constructor(entity, url, mirrorBasedOnVel = false){
    this.entity = entity;
    this.lastDirection = 1;
    this.httpRequest = new XMLHttpRequest();
    this.mirrorBasedOnVel = mirrorBasedOnVel;

    let self = this;
    this.httpRequest.onreadystatechange = function(){self.finish()};
    this.httpRequest.open('GET', url);
    this.httpRequest.setRequestHeader('Content-Type', 'text/json');
    this.httpRequest.send();
    this.animations = {};
  }
  /**
  * puts images of the sprite in an array of images to be animated
  */
  finish(){
    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
      if (this.httpRequest.status === 200) {
        this.data = JSON.parse(this.httpRequest.responseText);
        for(let animation of this.data.animations){
          let images = [];
          images.frameDuration = animation.frameDuration;
          this.animations[animation.name] = images;
          for(let i = animation.range[0]; i<= animation.range[1]; i++){
            let url = this.data.base + animation.path + i + animation.extention;
            images.push(PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST));
          }
        }
        this.sprite = new PIXI.Sprite(this.animations[this.data.default][0]);
        this.index = 0;
        this.animation = this.data.default;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.data.default].frameDuration/16;
        this.delayLeft = this.delay;
        this.needToAdd = true;
      }
    }
  }
/**
* updates the stage and the location of the character
* @param {Container} stage the level where the game is being played
*/
  update(stage){
    if(this.needToAdd){
      stage.addChild(this.sprite);
    }
    if(!this.sprite){
      return;
    }
    this.sprite.position.x = this.entity.pos.x-this.sprite.width/2;
    this.sprite.position.y = -this.entity.pos.y-74;
    this.sprite.scale.x = this.entity.box.width/this.data.width;
    this.sprite.scale.y = this.entity.box.width/this.data.width;
    if(this.mirrorBasedOnVel){
      let mirror = (this.entity.vel.x > 0) ? -1 : 1;
      let inverseMirror = (this.entity.vel.x < 0) ? -1 : 1;
      this.sprite.scale.x *= (mirror !== inverseMirror) ? mirror : this.lastDirection;
      this.lastDirection = (mirror !== inverseMirror) ? mirror : this.lastDirection;
      this.sprite.position.x += (this.sprite.scale.x < 0) ? this.sprite.width : 0;
    }
    this.delayLeft --;
    if(this.animation !== this.entity.state){
      if(this.animations[this.entity.state]){
        this.delayLeft = 0;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.entity.state].frameDuration/16;
        this.animation = this.entity.state;
      }
    }
    if(this.delayLeft < 0){
      this.index ++;
      if(this.index >= this.animations[this.animation].length){
        this.index = 0;
      }
      this.sprite.texture = this.animations[this.animation][this.index];
      this.delayLeft = this.delay;
    }
  }
}

export default AnimatedEntityRenderer;
