import LightSource from "./Physics/LightSource.js";
/** Class representing the lighting effects of the game*/
class LightingMask{
    /**
    * Creates a canvas layer over the game that darkens the enviorment and lighens up certain areas
    * @constructor
    * @param {PIXI.Container} stage the stage that the game is played on
    * @param {PIXI.WebGLRenderer} renderer the renderer of the game
    * @param {Runner} runner the player character in the center of the screen
    */
    constructor(stage, renderer, runner){
      this.pulseValue = 0.005;
      this.runner = runner;
      this.lightSources = [];
      this.draw = renderer;
      let width = this.draw.view.width;
      let height = this.draw.view.width;
      this.baseStage = stage;
      this.daylight = new PIXI.Graphics();
			//Set this.daylight color to shade from Black to White (dont use alpha coz it doesnt blend well)
			this.daylight.beginFill(0x0B0B0B);//0x0B0B0B);//0x111111);//0x151515);//0x202021);//0x4f4f50);
			//Draw a rectangle for daylight (size of stage)
			this.daylight.drawRect(0, 0, width, height);
			//Create a container for lights, a texture will be made from this later
			this.lights  = new PIXI.Container();
      this.lightEntities = new PIXI.Container();
			//Create lights from light cookie
      /**
			this.light = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/Vignette/Vignette.png", false, PIXI.SCALE_MODES.NEAREST));
			this.light.width= 500;
			this.light.height= 500;
      this.light.position.x = 425;
      this.light.position.y = 50;
      */
			//Use ADDITIVE blend modes so lights merge nicely.
			//this.light.blendMode = PIXI.BLEND_MODES.ADD;
			this.daylight.blendMode = PIXI.BLEND_MODES.ADD;
      this.lights.addChild(this.daylight);
      this.lights.addChild(this.lightEntities);
			//this.lights.addChild(this.light);

			//Create a texture where lights will be rendered to
			this.texture = new PIXI.RenderTexture.create(width,height);
			this.lightsTex = new PIXI.Sprite(this.texture);
			//Render the light texture
			this.draw.render(this.lights, this.texture);
			this.baseStage.mask = this.lightsTex;
			this.draw.roundPixels = true;
    }

    /**
    * Adds new light source to the stage that follows sprite
    * @param {object} follow the entity or element that light follows
    */
    addLightSource(follow){
      //console.log("test, Lightmask.js:52");
      let newLight = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/Vignette/VignetteLight.png", false, PIXI.SCALE_MODES.NEAREST));
      newLight.position.x = follow.pos.x - newLight.width/2;
      newLight.position.y = follow.pos.y - newLight.height/2;
      newLight.blendMode = PIXI.BLEND_MODES.ADD;
      this.lightEntities.addChild(newLight);
      let pulse = true;
      if(follow.type === "Runner"){
        pulse = false;
      }
      let source = new LightSource(follow, newLight, pulse);
      this.lightSources.push(source);
    }

    /**
    * updates the position of the lights according to all light sources
    */
    animate() {
      this.lightEntities.y = this.runner.pos.y+document.body.offsetHeight/2;
      this.lightEntities.x = -this.runner.pos.x+document.body.offsetWidth/2;
      for(let light of this.lightSources){
        light.update();
      }
      //Render the new texture for lights
      this.draw.render(this.lights, this.texture);
    }

}
export default LightingMask;
