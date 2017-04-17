import LightSource from "./Physics/LightSource.js";
/** Class representing the lighting effects of the game*/
class LightingMask{
    /**
    * Creates a canvas layer over the game that darkens the enviorment and lighens up certain areas
    * @constructor
    * @param {PIXI.Container} stage the stage that the game is played on
    * @param {PIXI.WebGLRenderer} renderer the renderer of the game
    */
    constructor(stage,renderer){
      this.draw = renderer;
      let width = this.draw.view.width;
      let height = this.draw.view.height;
      this.baseStage = stage;
      this.daylight = new PIXI.Graphics();
			//Set this.daylight color to shade from Black to White (dont use alpha coz it doesnt blend well)
			this.daylight.beginFill(0x0B0B0B);//0x0B0B0B);//0x111111);//0x151515);//0x202021);//0x4f4f50);
			//Draw a rectangle for daylight (size of stage)
			this.daylight.drawRect(0, 0, width, height);
			//Create a container for lights, a texture will be made from this later
			this.lights  = new PIXI.Container();
			//Create lights from light cookie
			this.light = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/Vignette/VignetteLight.png", false, PIXI.SCALE_MODES.NEAREST));
			this.light.width= 500;
			this.light.height= 500;
      this.light.position.x = width;
      this.light.position.y = height;
			this.light2 = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/Vignette/VignetteLight.png", false, PIXI.SCALE_MODES.NEAREST));
      this.light2.position.x = width/2;
      this.light2.position.y = height/2;
			//Use ADDITIVE blend modes so lights merge nicely.
			this.light.blendMode = PIXI.BLEND_MODES.ADD;
			this.light2.blendMode = PIXI.BLEND_MODES.ADD;
			this.daylight.blendMode = PIXI.BLEND_MODES.ADD;
      this.lights.addChild(this.daylight);
			this.lights.addChild(this.light);
			this.lights.addChild(this.light2);

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
    * @param {LightSource} lightSource the light source object that represents location of light
    */
    addLightSource(lightSource){

    }

    /**
    * updates the position of the lights according to all light sources
    */
    animate() {
      //this.light.alpha = this.light.alpha - 0.01; //change opacity of light
      //this.light2.position.y += 1;
      //Render the new texture for lights
      this.draw.render(this.lights, this.texture);
    }
}
export default LightingMask;
