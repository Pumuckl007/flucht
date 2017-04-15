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
      this.daylight = new PIXI.Graphics();
			//Set this.daylight color to shade from Black to White (dont use alpha coz it doesnt blend well)
			this.daylight.beginFill(0x0B0B0B);//0x111111);//0x151515);//0x202021);//0x4f4f50);
			//Draw a rectangle for daylight (size of stage)
			this.daylight.drawRect(0, 0, width, height);

			this.baseStage = stage;
			//Create a container for lights, a texture will be made from this later
			this.lights  = new PIXI.Container();
			//Create lights from light cookie
			this.light = PIXI.Sprite.fromImage("/assets/Vignette.png");
			this.light.width= 1920;//500;
			this.light.height= 1080;//500;
			this.light.x = 500;
			this.light2 = PIXI.Sprite.fromImage("/assets/Vignette.png");
			this.light2.x = 1920;
			//Use ADDITIVE blend modes so lights merge nicely.
			this.light.blendMode = PIXI.BLEND_MODES.ADD;
			this.light2.blendMode = PIXI.BLEND_MODES.ADD;
			this.daylight.blendMode = PIXI.BLEND_MODES.ADD;
			this.lights.addChild(this.light);
			this.lights.addChild(this.light2);
			this.lights.addChild(this.daylight);
			//Create a texture where lights will be rendered to
			this.texture = new PIXI.RenderTexture.create(width,height);
			this.lightsTex = new PIXI.Sprite(this.texture);
			//Render the light texture
			this.draw.render(this.lights, this.texture);
			this.baseStage.mask = this.lightsTex;
			this.draw.roundPixels = true
    }

    /**
    * updates the position of the lights according to all light sources
    */
    animate() {
      //this.light.alpha = this.light.alpha - 0.01;
      //this.light2.position.y += 1;
      //Render the new texture for lights
      this.draw.render(this.lights, this.texture);
    }
}
export default LightingMask;
