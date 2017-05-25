import LightingMask from "./LightingMask.js";
/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(stage, renderer, displayStage, lightingMask){
    this.stage = stage;
    this.center = {x:this.stage.x, y:this.stage.y};
    this.renderer = renderer;
    this.displayStage = displayStage;
    this.lightingMask = lightingMask;
    this.scale = 0.1;
    this.width = this.stage.width*this.scale;//this.renderer.view.width;
    this.height = this.stage.height*this.scale;//this.renderer.view.height;

    this.graphics = new PIXI.Graphics();
    this.displayStage.addChild(this.graphics);
  	this.texture = new PIXI.RenderTexture.create(this.width, this.height);
  	this.miniMap = new PIXI.Sprite(this.texture);
    this.displayStage.addChild(this.miniMap);
    this.miniMap.position.set(-this.width/2+5,-this.height/3+10);
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(0, 0, this.miniMap.width/4+10, this.miniMap.height/3.5+20);
    console.log(this.displayStage.width, this.displayStage.height);
    console.log(this.texture.width, this.texture.height);
  //  this.lightingMask.resize();
  }

  centerMap(){
    this.center = {x:this.stage.x, y:this.stage.y};
    // let croppedTexture = new PIXI.RenderTexture.create(this.texture, new PIXI.Rectangle(this.center.x,this.center.y, this.stage.width, this.stage.height));
    // this.texture = croppedTexture;
    // this.miniMap.texture = this.texture;
  }

  resize(){
    this.texture = new PIXI.RenderTexture.create(this.width, this.height);
  	this.miniMap = new PIXI.Sprite(this.texture);
    this.graphics.clear();
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(0, 0, this.miniMap.width/4+10, this.miniMap.height/3.5+20);
    //this.lightingMask.resize();
  }

  update(){
    let oldX = this.stage.x;
    let oldY = this.stage.y;
    this.stage.position.set(this.center.x, this.center.y);
    //this.miniMap.scale.x = this.miniMap.scale.y = 0.1;
    this.stage.scale.x = this.stage.scale.y = 0.1;
    this.lightingMask.scaleLight(0.1);
    //this.lightingMask.animate();

	  this.renderer.render(this.stage, this.texture);
    this.stage.position.set(oldX, oldY);
    //this.miniMap.scale.x = this.miniMap.scale.y = 1;
	  this.stage.scale.x = this.stage.scale.y = 1;

    this.lightingMask.scaleLight(1);

  }
}

export default MiniMap;
