import LightingMask from "./LightingMask.js";
/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(renderer, displayStage){
    this.renderer = renderer;
    this.displayStage = displayStage;
    this.entities = [];
    this.rooms = [];
    this.elements = [];
    this.scale = 0.075;//0.075;
    // this.scaleX = this.scale+0.004;
    // this.scaleY = this.scale+0.004;
    this.xOffSet = 426;
    this.yOffSet = 229;
    this.width = 275;
    this.height = 150;

    this.graphics = new PIXI.Graphics();
    this.movingGraphics = new PIXI.Graphics();
    this.displayStage.addChild(this.graphics);
    this.displayStage.addChild(this.movingGraphics);
    this.graphics.beginFill(0xffffff);
  }

  updateTerrain(terrain){
    this.terrain = terrain;
    this.rooms = this.terrain.rooms;
    this.elements = this.terrain.elements;
    console.log(terrain.width, terrain.height);
    this.graphics.clear();
    this.graphics.beginFill(0xffffff);
    this.graphics.drawRect(0, 0, 270, 146);
    this.graphics.endFill();
    this.graphics.beginFill(0x000000);
    for(let room of this.rooms){
      let roomX = room.x-this.xOffSet;
      let roomY = room.y-this.yOffSet;
      this.graphics.drawRect(roomX*this.scale+5, roomY*this.scale+5, room.box.width*this.scale, room.box.height*this.scale);
    //  console.log(roomX*this.scale+5, roomY*this.scale+5, room.box.width*this.scale, room.box.height*this.scale);
    }
    this.graphics.endFill();
    this.graphics.beginFill(0xffffff);//0xff4500);
    for(let element of this.elements){
      if(!element.ghost && !element.interactive){
        let width = element.box.width;
        let height = element.box.height;
        let xPos = element.pos.x - width/2;
        let yPos = element.pos.y - height/2
        this.graphics.drawRect(xPos*this.scale+6, -yPos*this.scale+141, width*this.scale, -height*this.scale);
      }
    }
  }

  addEntity(entity){
    this.entities.push(entity);
  }

  resize(){
    this.texture = new PIXI.RenderTexture.create(this.width, this.height);
  	this.miniMap = new PIXI.Sprite(this.texture);
  }

  update(){
    this.movingGraphics.clear();
    this.movingGraphics.beginFill(0xff0000);
    for(let entity of this.entities){
      this.movingGraphics.drawCircle(entity.pos.x*this.scale+6, -entity.pos.y*this.scale+141, 3, 3);
    }
  }
}

export default MiniMap;
