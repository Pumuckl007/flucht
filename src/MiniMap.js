import LightingMask from "./LightingMask.js";
/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(stage, renderer, displayStage){
    this.stage = stage;
    this.center = {x:this.stage.x, y:this.stage.y};
    this.renderer = renderer;
    this.displayStage = displayStage;
    this.entities = [];
    this.rooms = [];
    this.elements = [];
    //this.lightingMask = lightingMask;
    this.scale = 0.1;
    this.width = 350;//this.renderer.view.width;
    this.height = 193;//this.renderer.view.height;

    //console.log(this.displayStage.width, this.displayStage.height);
    this.graphics = new PIXI.Graphics();
    this.movingGraphics = new PIXI.Graphics();
    this.displayStage.addChild(this.graphics);
    this.displayStage.addChild(this.movingGraphics);
    this.graphics.beginFill(0xffffff);
  //  this.graphics.drawRect(0, 0, this.width, this.height);

  	// this.texture = new PIXI.RenderTexture.create(this.renderer.view.width, this.renderer.view.height);
  	// this.miniMap = new PIXI.Sprite(this.texture);
    // this.displayStage.addChild(this.miniMap);
    // this.miniMap.position.set(0/*-this.width/2+5*/,0/*-this.height/3+10*/);
    //console.log(this.texture.width, this.texture.height);
  //  this.lightingMask.resize();
  }

  centerMap(){
    this.center = {x:this.stage.x, y:this.stage.y};
    // let croppedTexture = new PIXI.RenderTexture.create(this.texture, new PIXI.Rectangle(this.center.x,this.center.y, this.stage.width, this.stage.height));
    // this.texture = croppedTexture;
    // this.miniMap.texture = this.texture;
  }

  updateTerrain(terrain){
    this.terrain = terrain;
    this.rooms = this.terrain.rooms;
    this.elements = this.terrain.elements;
    //this.graphics.clear();
    // this.graphics.beginFill(0x000000);
    // for(let room of this.rooms){
    //   this.graphics.drawRect(room.x*(this.scale+0.001)-40, room.y*(this.scale+0.002)-20, room.box.width*this.scale, room.box.height*this.scale);
    // }
    // for(let element of this.elements){
    //
    // }
  }

  addEntity(entity){
    this.entities.push(entity);
  }

  resize(){
    this.texture = new PIXI.RenderTexture.create(this.width, this.height);
  	this.miniMap = new PIXI.Sprite(this.texture);
  }

  update(){
    for(let entity of this.entities){

    }
    // let oldX = this.stage.x;
    // let oldY = this.stage.y;
    // this.stage.position.set(0,100);
    //this.miniMap.scale.x = this.miniMap.scale.y = 0.1;
  //  this.stage.scale.x = this.stage.scale.y = 0.1;
  //  this.lightingMask.scaleLight(0.1);
    //this.lightingMask.animate();
    //
	  // this.renderer.render(this.stage, this.texture);
    // this.stage.position.set(oldX, oldY);
    // //this.miniMap.scale.x = this.miniMap.scale.y = 1;
	  // this.stage.scale.x = this.stage.scale.y = 1;
    //
    // this.lightingMask.scaleLight(1);

  }
}

export default MiniMap;
