
/**
* a class to represent the trap ghost
*/
class TrapGhost{

  constructor(){
    this.boudingBox = {w: 0, h:0};
    this.textureCache = {};
    this.sprite = new PIXI.Sprite();
    this.urlCache = {};
    this.element = false;
    this.width = 0;
    this.height = 0;
  }

  /**
  * loads a new texture into the TrapGhost
  */
  loadTexture(discription){
    let url = discription.base +
     discription.animations[discription.defaultId].range[0] +
     discription.animations[discription.defaultId].extention;
    if(this.textureCache[url]){
      this.sprite.texture = this.textureCache[url];
      this.sprite.scale.x = discription.scaleX;
      this.sprite.scale.y = discription.scaleY;
    } else {
      this.textureCache[url] = PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST);
      this.sprite.texture = this.textureCache[url];
      this.sprite.scale.x = discription.scaleX;
      this.sprite.scale.y = discription.scaleY;
    }
    this.width = discription.width*discription.scaleX;
    this.height = discription.height *discription.scaleY;
  }

  /**
  * sets the element to a new element
  * @param {Trap} element the element
  */
  setElement(element){
    if(this.element === element){
      return;
    }
    this.element = element;
    if(this.urlCache[element.url]){
      this.loadTexture(this.urlCache[element.url]);
    } else {
      let self = this;
      httpRequest(element.trap.url, function(response){
        self.urlCache[element.url] = response;
        self.loadTexture(response);
      });
    }
  }

  show(){
    this.sprite.visible = true;
  }

  hide(){
    this.sprite.visible = false;
  }

  setValidity(valid){
    if(valid){
      this.sprite.tint = 0x44FF44;
    } else {
      this.sprite.tint = 0xFF4444;
    }
  }

  setPos(x, y){
    this.sprite.x = x - this.width/2;
    this.sprite.y = y - this.height/2;
  }

}

/**
* makes an XMLHttpRequest with the given arguments at the url and calls the callback with the data
* @param {String} url the url to querry
* @param {Function} callback the callback function
* @param {Object} passArg the arguments to directly pass into the callback
*/
var httpRequest = function httpRequest(url, callback, passArg){
  let theHttpRequest = new XMLHttpRequest();
  theHttpRequest.onreadystatechange = function(){
    if (theHttpRequest.readyState === XMLHttpRequest.DONE) {
      if (theHttpRequest.status === 200) {
        callback(JSON.parse(theHttpRequest.responseText), passArg)
      }
    }
  };
  theHttpRequest.open('GET', url);
  theHttpRequest.setRequestHeader('Content-Type', 'text/json');
  theHttpRequest.send();
}

export default TrapGhost;
