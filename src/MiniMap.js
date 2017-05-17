/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(stage, renderer){
    this.stage = stage;
    this.renderer = renderer;
    this.width = this.renderer.view.width;
    this.height = this.renderer.view.height;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xdb5e5e, 0.5);
    this.graphics.lineStyle(2, 0xdb5e5e);
    this.graphics.drawRect(-200, -200, 170, 130);
    this.stage.addChild(this.graphics);

  	this.texture = PIXI.RenderTexture.create(this.width, this.height);
    this.stage.scale.x = this.stage.scale.y = 0.15;
	  this.renderer.render(this.stage, this.texture);
	  this.stage.scale.x = this.stage.scale.y = 1;

  	this.miniMap = new PIXI.Sprite(this.texture); //output sprite
  	this.miniMap.position.set(-200, -200);
    this.miniMap.scale.x = this.width*0.15;
    this.miniMap.scale.y = this.height*0.15;
    console.log(this.miniMap);
  //	console.log('created mini map at ' + this.miniMap.x, this.miniMap.y);

    this.stage.addChild(this.miniMap);
  }

  update(){
    this.stage.scale.x = this.stage.scale.y = 0.15;
	  this.renderer.render(this.stage, this.texture);
	  this.stage.scale.x = this.stage.scale.y = 1;
  }
}

export default MiniMap;
