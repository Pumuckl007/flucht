import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";

class Renderer{
  constructor(runner){
    this.runner = runner;
    this.typeMap = {};
    this.stage = new PIXI.Container();
    this.stage.y = this.runner.pos.y+400;
    this.stage.x = -this.runner.pos.x+300;
    this.renderer = new PIXI.WebGLRenderer(800, 600);
    this.renderers = [];
    this.graphics = new PIXI.Graphics();
    this.stage.addChild(this.graphics);
    initMap(this.typeMap);
  }

  onEvent(type, object){
    if(type === "Entity Added"){
      let renderer = new AnimatedEntityRenderer(object, this.typeMap[object.type], true);
      this.renderers.push(renderer);
    }
    if(type === "Terrain Updated"){
      this.terrain = object;
    }
  }

  render(){
    this.stage.y = this.runner.pos.y+300;
    this.stage.x = -this.runner.pos.x+400;
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
