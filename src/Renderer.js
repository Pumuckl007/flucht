import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";
import AnimatedTexture from "./AnimatedTexture.js";
/**
* @module Renderer
*/
/** Creates the stage and updates the stage*/
class Renderer{
  /**
  * Creates the render object and creates and prepares the stage to be drawn on
  * @constructor
  * @param {Runner} runner the player
  */
  constructor(runner){
    this.runner = runner;
    this.typeMap = {};
    this.stage = new PIXI.Container();
    this.stage.y = this.runner.pos.y+400;
    this.stage.x = -this.runner.pos.x+300;
    this.renderer = new PIXI.WebGLRenderer(1600, 900);
    this.renderers = [];
    this.renderer.backgroundColor = 0x101010;
    this.graphics = new PIXI.Graphics();
    this.scale = 1;
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
    initMap(this.typeMap);
    let self = this;
    window.onresize = function(event){ self.resize(event)};

    //Create the lighting mask layer
    var lighting = new PIXI.display.Layer();
    lighting.on('display', function (element) {
        element.blendMode = PIXI.BLEND_MODES.ADD
    });
    lighting.filters = [new PIXI.filters.VoidFilter()];
    lighting.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
    lighting.filterArea = new PIXI.Rectangle(0, 0, this.stage.width, this.stage.height);
    this.stage.addChild(lighting);
    var ambient = new PIXI.Graphics();
    ambient.beginFill(0x808080, 1.0);
    ambient.drawRect(0, 0, this.stage.width, this.stage.height);
    ambient.endFill();
    lighting.addChild(ambient);
  }

 /**
 * Checks if Entity is added, terain is udated or if level is Loaded
 * @param {String} type the event that is passed
 * @param {Object} object the entity, terrian or level that is added in the event
 */
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
 /**
 * Resizes the stage when the window is resized
  @param {resizeEvent} event the resizeEvent
 */
  resize(event){
    this.renderer.resize(document.body.offsetWidth, document.body.offsetHeight);
  }

  /**
  * positions the stage and updates it
  */
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
    this.graphics.beginFill(0x000000);
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

/**
* The map relays the name of an entity to Json assets
* @param {map} map the map to be initionalized
*/
function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
}

export default Renderer;
