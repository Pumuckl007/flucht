/** Creates animated texture for any animated element that does not move in the stage*/
class AnimatedTexture{
  /**
  * Finds the image frames from the given url
  * @constructor
  * @param {String} url location of the background images
  * @param {number} x x-coordinate of texture
  * @param {number} y y-coordinate of texture
  * @param {function} done adds child to the stage
  */
  constructor(url, x, y, done, element){
    this.httpRequest = new XMLHttpRequest();
    this.x = x;
    this.y = y;

    let self = this;
    this.httpRequest.onreadystatechange = function(){self.finish()};
    this.httpRequest.open('GET', url);
    this.httpRequest.setRequestHeader('Content-Type', 'text/json');
    this.httpRequest.send();
    this.animations = {};
    this.done = done;
    if(element){
      this.element = element;
    }
  }

  /**
  * adds images to array to be animated
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
            if(!cache[url]){
              cache[url] = PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST)
            }
            images.push(cache[url]);
          }
        }
        this.sprite = new PIXI.Sprite(this.animations[this.data.default][0]);
        this.index = Math.floor(Math.random()*this.animations[this.data.default].length);
        this.animation = this.data.default;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.data.default].frameDuration/16;
        this.delayLeft = this.delay;
        this.sprite.scale.x = this.data.scaleX;
        this.sprite.scale.y = this.data.scaleY;
        this.sprite.position.x = this.x;
        this.sprite.position.y = this.y;
        this.done(this);
      }
    }
  }
/**
* updates the animated image
*/
  update(){
    if(!this.sprite){
      return;
    }
    this.delayLeft --;
    if(this.delayLeft < 0){
      this.index ++;
      if(this.index >= this.animations[this.animation].length){
        this.index = 0;
      }
      this.sprite.texture = this.animations[this.animation][this.index];
      this.delayLeft = this.delay;
    }
    if(!this.element){
      return;
    }
    if(this.animation !== this.element.state){
      if(this.animations[this.element.state]){
        this.delayLeft = 0;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.element.state].frameDuration/16;
        this.animation = this.element.state;
      }
    }
  }
}

let cache = {};

export default AnimatedTexture;
