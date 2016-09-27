import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";
import Background from "./Background";

class Renderer{
  constructor(runner){
    this.runner = runner;
    this.typeMap = {};
    this.stage = new PIXI.Container();
    this.stage.y = this.runner.pos.y+400;
    this.stage.x = -this.runner.pos.x+300;
    this.renderer = new PIXI.WebGLRenderer(1600, 900);
    this.renderers = [];
    this.graphics = new PIXI.Graphics();
    this.scale = 2;
    this.stage.scale.x = 2;
    this.stage.scale.y = 2;
    this.stage.addChild(this.graphics);
    initMap(this.typeMap);
    let self = this;
    window.onresize = function(event){ self.resize(event)};
  }

  onEvent(type, object){
    if(type === "Entity Added"){
      let renderer = new AnimatedEntityRenderer(object, this.typeMap[object.type], true);
      this.renderers.push(renderer);
    }
    if(type === "Terrain Updated"){
      this.terrain = object;
    }
    if(type === "Level Loaded"){
      if(this.background){
        this.stage.removeChild(this.background.stage);
      }
      this.background = new Background(object);
      this.stage.addChild(this.background.stage);
    }
  }

  resize(event){
    this.renderer.resize(document.body.offsetWidth, document.body.offsetHeight);
  }

  render(){
    this.stage.y = this.scale*this.runner.pos.y+document.body.offsetHeight/2;
    this.stage.x = -this.scale*this.runner.pos.x+document.body.offsetWidth/2;
    if(this.background){
      this.background.update(this.stage.x, this.stage.y);
    }
    if(!this.initilized){
      this.initilized = true;
      document.body.appendChild(this.renderer.view)
    }
    for(let renderer of this.renderers){
      renderer.update(this.stage);
    }
    this.graphics.clear();
    this.graphics.beginFill(0x0000FF);
    for(let element of this.terrain.elements){
      this.graphics.drawRect(element.pos.x-element.box.width/2,
          -element.pos.y-element.box.height/2,
          element.box.width,
          element.box.height);
    }
    this.renderer.render(this.stage);
  }
}

function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
}

export default Renderer;
