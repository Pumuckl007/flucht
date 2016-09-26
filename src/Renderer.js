import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";

class Renderer{
  constructor(){
    this.typeMap = {};
    this.stage = new PIXI.Container();
    this.stage.y = 600;
    this.stage.x = 400;
    this.renderer = new PIXI.WebGLRenderer(800, 600);
    this.renderers = [];
    initMap(this.typeMap);
  }

  onEvent(type, object){
    if(type === "Entity Added"){
      let renderer = new AnimatedEntityRenderer(object, this.typeMap[object.type], true);
      this.renderers.push(renderer);
    }
  }

  render(){
    if(!this.initilized){
      this.initilized = true;
      document.body.appendChild(this.renderer.view)
    }
    for(let renderer of this.renderers){
      renderer.update(this.stage);
    }
    this.renderer.render(this.stage);
  }
}

function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
}

export default Renderer;
