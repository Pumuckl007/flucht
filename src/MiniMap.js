import LightingMask from "./LightingMask.js";
import Box from "./Physics/Box.js";
/** Class that keeps tarck of player's location on the map and draws it*/
class MiniMap{
  /**Creates a Minimap object that tracks the entity and its location on the map
  * @constructor
  */
  constructor(renderer, displayStage){
    this.runnerAdded = false;
    this.renderer = renderer;
    this.displayStage = displayStage;
    this.entities = [];
    this.rooms = [];
    this.elements = [];
    this.scale = 0.05;//0.075;
    // this.scaleX = this.scale+0.004;
    // this.scaleY = this.scale+0.004;
    this.xOffSet = 426;
    this.yOffSet = 229;
    this.width = 300;
    this.height = 300;
    this.stageBox = new Box(this.width, this.height);
    this.graphicObjects = [];


    this.temp = new PIXI.Graphics();
    displayStage.addChild(this.temp);

    this.graphics = new PIXI.Graphics();
    this.movingGraphics = new PIXI.Graphics();
    this.displayStage.addChild(this.graphics);
    this.displayStage.addChild(this.movingGraphics);
    this.graphics.beginFill(0xffffff);
  }

  addRunner(runner){
    this.runner = runner;
    this.runnerAdded = true;
  }

  cullBackgrounds(){
    if(this.runnerAdded){
       let x = (this.runner.pos.x*this.scale);//-(this.displayStage.x/2)/this.scale;
       let y = -(this.runner.pos.y*this.scale);//-(this.displayStage.y/2)/this.scale;
      //let x = -(this.displayStage.x - window.innerWidth/2)*this.scale;
      //let y = -(this.displayStage.y - window.innerHeight/2)*this.scale;
      //console.log(x,y);
      this.temp.clear();
       this.temp.beginFill(0xffffff);
       this.temp.drawRect(x,y,this.stageBox.width,this.stageBox.height); //display the stage box
       this.temp.endFill();
      //console.log(x, y);
      for(let i = 0; i<this.graphicObjects.length; i++){
        let graphic = this.graphicObjects[i];
        let box = graphic.box;
        let deltaX = graphic.pos.x + box.width/2 - x;
        let deltaY = graphic.pos.y + box.height/2 - 10 - y;
        graphic.visible = box.intersects(this.stageBox, deltaX, deltaY);
      }
    }
  }

  updateTerrain(terrain){
    this.terrain = terrain;
    this.rooms = this.terrain.rooms;
    this.elements = this.terrain.elements;
    //this.scale = (this.width-10)/(this.terrain.width*this.terrain.roomWidth); //calculates the scale needed to fit map into minimap size
    if(this.rooms.width != 0){
      for(let room of this.rooms){
        let roomX = room.x-this.xOffSet;
        let roomY = room.y-this.yOffSet;
        let roomGraphic = new GraphicObject(roomX*this.scale+5, roomY*this.scale+5, room.box.width*this.scale, room.box.height*this.scale, 0x000000);
        this.graphicObjects.push(roomGraphic);
        //this.graphics.drawRect(roomGraphic.pos.x, roomGraphic.pos.y, roomGraphic.width, roomGraphic.height);
      }
      this.graphics.endFill();

      this.graphics.beginFill(0xffffff);//0xff4500);
      for(let element of this.elements){
        if(!element.ghost && !element.interactive){
          let width = element.box.width;
          let height = element.box.height;
          let xPos = (element.pos.x - width/2)*this.scale+6;
          let yPos = (element.pos.y - height/2)*this.scale-83;
          let elementGraphic = new GraphicObject(xPos, -yPos+this.height-150, width*this.scale, -height*this.scale, 0xffffff);
          this.graphicObjects.push(elementGraphic);
          //this.graphics.drawRect(elementGraphic.pos.x, elementGraphic.pos.y, elementGraphic.width, elementGraphic.height);
        }
      }
    }
  }

  addEntity(entity){
    this.entities.push(entity);
    //this.graphicObjects.push(new GraphicObject(0, 0, 2, 2, 0x0000ff));
  }

  update(){
    this.cullBackgrounds();
    this.movingGraphics.clear();
    this.movingGraphics.beginFill(0x0000ff);
    for(let entity of this.entities){
      if(entity.murderer && entity.type != "Remote Runner"){
        this.movingGraphics.endFill();
        this.movingGraphics.beginFill(0xff0000);
        this.movingGraphics.drawCircle(entity.pos.x*this.scale+7, (-entity.pos.y+(this.terrain.height*this.terrain.roomHeight))*this.scale+3, 2, 2);
        this.movingGraphics.endFill();
        this.movingGraphics.beginFill(0x0000ff);
      }else if(!entity.murderer){
        this.movingGraphics.drawCircle(entity.pos.x*this.scale+7, (-entity.pos.y+(this.terrain.height*this.terrain.roomHeight))*this.scale+3, 2, 2);
      }
    }
    this.graphics.clear();
    let color = -1;
    for(let graphic of this.graphicObjects){
      if(graphic.visible){
        if(graphic.color != color){
          this.graphics.endFill();
          color = graphic.color;
          this.graphics.beginFill(color);
        }
        this.graphics.drawRect(graphic.pos.x, graphic.pos.y, graphic.width, graphic.height);
      }
    }
  }
}

/* Class that represents the physical location of the graphics being displayed*/
class GraphicObject{
  constructor(xPos, yPos, width, height, color){
    this.pos = {x: xPos, y:yPos};
    this.width = width;
    this.height = height;
    this.box = new Box(width, height);
    this.visible = true;
    this.color = color;
  }

  setPos(newX, newY){
    this.pos.x = newX;
    this.pos.y = newY;
  }
}

export default MiniMap;
