import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";
import AnimatedTexture from "./AnimatedTexture.js";

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
    this.scale = 1;
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
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
      for(let room of this.terrain.rooms){
        let sprite = new PIXI.Sprite(PIXI.Texture.fromImage(room.description.background, false, PIXI.SCALE_MODES.NEAREST));
        sprite.position.x = room.x-room.box.width/2;
        sprite.position.y = -room.y-room.box.height/2+10;
        sprite.scale.x = 2;
        sprite.scale.y = 2;
        this.stage.addChild(sprite);
      }
      this.stage.addChild(this.graphics);
      for(let element of this.terrain.elements){
        if(element.type === "Textured Element"){
          let self = this;
          let done = function(animatedTexture){
            self.graphics.addChild(animatedTexture.sprite);
            self.renderers.push(animatedTexture);
          }
          new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done);
        }
      }
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
      if(element.renderAsBox){
        this.graphics.drawRect(element.pos.x-element.box.width/2,
          -element.pos.y-element.box.height/2,
          element.box.width,
          element.box.height);
      }
    }
    this.renderer.render(this.stage);
  }
}

function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
}

export default Renderer;
