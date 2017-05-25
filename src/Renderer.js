import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";
import AnimatedTexture from "./AnimatedTexture.js";
import LightingMask from "./LightingMask.js";
import StatusBars from "./StatusBars.js";
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
  constructor(){
    this.runner = false;
    this.typeMap = {};
    this.container = new PIXI.Container();
    this.stage = new PIXI.Container();
    this.placementLayer = new PIXI.Container();
    this.container.addChild(this.stage);
    this.container.addChild(this.placementLayer);
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);//new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
    this.renderers = [];
    this.renderer.backgroundColor = 0x101010;
    this.graphics = new PIXI.Graphics();
    this.scale = 1;
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
    initMap(this.typeMap);
    let self = this;
    window.onresize = function(event){ self.resize(event)};

    this.light = new LightingMask(this.stage, this.renderer);
    this.barLayer = new PIXI.Graphics();
    this.statusBars = new StatusBars(this.barLayer);

  }

  /**
  * adds a sprite to the placement layer
  * @param {Sprite} sprite the sprite to add
  */
  addPlacementSprite(sprite){
    this.placementLayer.addChild(sprite);
  }

 /**
 * Checks if Entity is added, terain is updated or if level is Loaded
 * @param {String} type the event that is passed
 * @param {Object} object the entity, terrian or level that is added in the event
 */
  onEvent(type, object){
    if(type === "Entity Added"){
      let renderer = new AnimatedEntityRenderer(object, this.typeMap[object.type], true);
      if(object.type === "Runner"){
        this.light.addLightSource(object);
      }
      this.statusBars.addHealthBar(object);
      this.renderers.push(renderer);
    }
    if(type === "Terrain Updated"){
      this.terrain = object;
    }
    if(type === "Element Added"){
      let element = object;
      if(element.type === "Textured Element" || element.type === "Lit Element"|| element.interactive){
        let self = this;
        let done = function(animatedTexture){
          self.graphics.addChild(animatedTexture.sprite);
          self.renderers.push(animatedTexture);
        }
        if(element.type === "Lit Element"){
          this.light.addLightSource(element);
        }
        if(element.interactive){
          this.statusBars.addBearTrapBar(element);
        }
        if(element.interactive){
          new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done, element);
        } else {
          new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done);
        }
      }
    }
    if(type === "Reset"){
      for(let renderer of this.renderers){
        if(renderer.sprite)
          this.graphics.removeChild(renderer.sprite);
      }
      this.light.clear();
      this.stage.removeChildren();
      this.renderers = [];
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
      this.stage.addChild(this.barLayer);
      for(let element of this.terrain.elements){
        if(element.type === "Textured Element" || element.type === "Lit Element"|| element.interactive){
          let self = this;
          let done = function(animatedTexture){
            self.graphics.addChild(animatedTexture.sprite);
            self.renderers.push(animatedTexture);
          }
          if(element.type === "Lit Element"){
            this.light.addLightSource(element);
          }
          if(element.interactive){
            this.statusBars.addBearTrapBar(element);
          }
          if(element.interactive){
            new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done, element);
          } else {
            new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done);
          }
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
    this.light.resize();
  }

  /**
  * adds the runner to the renderer
  * @param {Runner} runner the player character in the center of the screen
  */
  addRunner(runner){
    this.runner = runner;
    this.light.addRunner(runner);
  }

  /**
  * positions the stage and updates it
  */
  render(){
    if(this.runner){
      this.stage.y = this.scale*this.runner.pos.y+document.body.offsetHeight/2;
      this.stage.x = -this.scale*this.runner.pos.x+document.body.offsetWidth/2;
    }
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
    this.barLayer.clear();
    this.statusBars.update();
    this.light.animate();
    this.graphics.clear();
    this.graphics.beginFill(0x000000);
    if(!this.terrain){
      return;
    }
    for(let element of this.terrain.elements){
      if(element.renderAsBox){
        this.graphics.beginFill(element.color);
        this.graphics.drawRect(element.pos.x-element.box.width/2,
          -element.pos.y-element.box.height/2,
          element.box.width,
          element.box.height);
      }
    }
    this.renderer.render(this.container);
  }

  /**
  * sets the x and y position of the stage
  * @param {number} x the x position
  * @param {number} y the y position
  */
  setPos(x, y){
    this.stage.y = this.scale*y+document.body.offsetHeight/2;
    this.stage.x = -this.scale*x+document.body.offsetWidth/2;
  }

  /**
  * enables the lighting
  */
  enableLighting(){
    this.light.enable();
  }

  /**
  * disables the lighting
  */
  disableLighting(){
    this.light.disable();
  }
}

/**
* The map relays the name of an entity to Json assets
* @param {map} map the map to be initionalized
*/
function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
  map["Remote Runner"] = "assets/Runner/Runner.json";
}

export default Renderer;
