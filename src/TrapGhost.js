
/**
* a class to represent the trap ghost
*/
class TrapGhost{

  constructor(){
    this.boudingBox = {w: 0, h:0};
    this.textureCache = {};
    this.sprite = new PIXI.Sprite();
    this.urlCache = {};
  }

  /**
  * loads a new texture into the TrapGhost
  */
  loadTexture(discription){
    if(this.textureCache[url]){
      this.sprite.texture = this.textureCache[url];
    } else {
      this.textureCache[url] = PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST);
      this.sprite.texture = this.textureCache[url];
    }
  }

  setElement(element){
    if(this.urlCache[element.url]){
      loadTexture(this.urlCache[element.url]);
    } else {
      let self = this;
      httpRequest(element.url, function(response){
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
      this.sprite.tint = 0xAAFFAA;
    } else {
      this.sprite.tint = 0xFFAAAA;
    }
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
