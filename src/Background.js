import AnimatedTexture from "./AnimateTexture.js";

class Background{
  constructor(url){
    this.stage = new PIXI.Container();
    this.elements = [];
    this.httpRequest = new XMLHttpRequest();

    let self = this;
    this.httpRequest.onreadystatechange = function(){self.loadElements()};
    this.httpRequest.open('GET', url);
    this.httpRequest.setRequestHeader('Content-Type', 'text/json');
    this.httpRequest.send();
  }

  loadElements(){
    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
      if (this.httpRequest.status === 200) {
        this.data = JSON.parse(this.httpRequest.responseText);
        for(let element of this.data.elements){
          for(let i = 0; i<element.number; i++){
            let x = 0;
            let y = 0;
            for(let k = 0; k<element.xGenerator.length; k++){
              x += element.xGenerator[k]*Math.pow(i*element.xStep, element.xGenerator.length-1-k);
            }
            for(let k = 0; k<element.yGenerator.length; k++){
              y += element.yGenerator[k]*Math.pow(i*element.yStep, element.yGenerator.length-1-k);
            }
            let stage = this.stage;
            let newElement = new AnimatedTexture(element.url, x, y, function(){
              stage.addChild(this.sprite);
            });
            this.elements.push(newElement);

          }
        }
        this.background = new PIXI.Sprite.fromImage(this.data.background, false, PIXI.SCALE_MODES.NEAREST);
        this.background.scale.x = this.data.scaleX;
        this.background.scale.y = this.data.scaleY;
        this.background.position.y = -this.data.height-this.data.offsetY;
        console.log(this.background.scale.x);
        this.stage.addChild(this.background);
      }
    }
  }

  update(x, y){
    for(let element of this.elements){
      element.update();
    }
    //Paralax WIP
    //this.stage.position.x = -x/3;
  }
}
export default Background;
