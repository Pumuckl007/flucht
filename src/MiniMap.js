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
    this.width = 400;
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
    this.scale = (this.width-10)/(this.terrain.width*this.terrain.roomWidth);
  //  console.log(this.scale);
    this.graphics.clear();
    this.graphics.beginFill(0xffffff);
    this.graphics.drawRect(0, 0, this.width, (this.terrain.height*this.terrain.roomHeight)*this.scale+10);
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
        let xPos = (element.pos.x - width/2)*this.scale;
        let yPos = (element.pos.y - height/2)*this.scale;
        this.graphics.drawRect(xPos+7, -yPos+this.height+63, width*this.scale, -height*this.scale);
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
      this.movingGraphics.drawCircle(entity.pos.x*this.scale+7, (-entity.pos.y+(this.terrain.height*this.terrain.roomHeight))*this.scale+3, 2, 2);
    }
  }
}

export default MiniMap;
