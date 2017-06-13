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
    this.stage = new PIXI.Container();
    this.displayStage.addChild(this.stage);
    this.entities = [];
    this.rooms = [];
    this.elements = [];
    this.scale = 0.075;//0.075;
    // this.scaleX = this.scale+0.004;
    // this.scaleY = this.scale+0.004;
    this.width = 300;
    this.height = 300;
    this.stageBox = new Box(this.width, this.height);
    this.graphicObjects = [];

    let boundsMask = new PIXI.Graphics();
    boundsMask.drawRect(0, 0, this.width, this.height);
    boundsMask.rendererable = true;
    boundsMask.cacheAsBitmap = true;
    displayStage.addChild(boundsMask);
    displayStage.mask = boundsMask;

    this.graphics = new PIXI.Graphics();
    this.movingGraphics = new PIXI.Graphics();
    this.stage.addChild(this.graphics);
    this.stage.addChild(this.movingGraphics);
    this.graphics.beginFill(0xffffff);
    this.playerBox = new Box(4,4);
  }

  addRunner(runner){
    this.runner = runner;
    this.runnerAdded = true;
  }

  cullBackgrounds(){
    if(this.runnerAdded){
      let x = -(this.runner.pos.x*this.scale) + this.width/2;//-(this.stage.x/2)/this.scale;
      let y = (this.runner.pos.y*this.scale) + this.height/2;//-(this.stage.y/2)/this.scale;
      this.stage.x = x;
      this.stage.y = y;
      // for(let i = 0; i<this.graphicObjects.length; i++){
      //   let graphic = this.graphicObjects[i];
      //   let box = graphic.box;
      //   let deltaX = (this.runner.pos.x*this.scale) - graphic.pos.x - box.width/2;
      //   let deltaY = -(this.runner.pos.y*this.scale) - graphic.pos.y - box.height/2;
      //   graphic.visible = box.intersects(this.stageBox, deltaX, deltaY);
      // }
    }
  }

  updateTerrain(terrain){
    this.terrain = terrain;
    this.rooms = this.terrain.rooms;
    this.elements = this.terrain.elements;
    //this.scale = (this.width-10)/(this.terrain.width*this.terrain.roomWidth); //calculates the scale needed to fit map into minimap size
    if(this.rooms.width != 0){
      for(let room of this.rooms){
        let roomX = room.x-room.box.width/2 - 10; // ten is a hack to get the wall width in there
        let roomY = room.y+room.box.height/2 - 10;
        let roomGraphic = new GraphicObject(roomX*this.scale, -roomY*this.scale, room.box.width*this.scale, room.box.height*this.scale, 0x000000);
        this.graphicObjects.push(roomGraphic);
        //this.graphics.drawRect(roomGraphic.pos.x, roomGraphic.pos.y, roomGraphic.width, roomGraphic.height);
      }
      this.graphics.endFill();

      this.graphics.beginFill(0xffffff);//0xff4500);
      for(let element of this.elements){
        if(!element.ghost && !element.interactive && !element.hiddenOnMiniMap){
          let width = element.box.width;
          let height = element.box.height;
          let xPos = (element.pos.x - width/2)*this.scale;
          let yPos = (element.pos.y + height/2)*this.scale;
          let elementGraphic = new GraphicObject(xPos, -yPos, width*this.scale, height*this.scale, 0xffffff);
          this.graphicObjects.push(elementGraphic);
          //this.graphics.drawRect(elementGraphic.pos.x, elementGraphic.pos.y, elementGraphic.width, elementGraphic.height);
        }
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

  addEntity(entity){
    this.entities.push(entity);
    //this.graphicObjects.push(new GraphicObject(0, 0, 2, 2, 0x0000ff));
  }

  update(){
    this.cullBackgrounds();
    this.movingGraphics.clear();
    this.movingGraphics.beginFill(0x0000ff);
    for(let entity of this.entities){
      if(entity.hidden){
        continue;
      }
      let box = entity.box;
      let deltaX = (this.runner.pos.x*this.scale) - entity.pos.x*this.scale;
      let deltaY = (this.runner.pos.y*this.scale) - entity.pos.y*this.scale;
      if(this.playerBox.intersects(this.stageBox, deltaX, deltaY)){
        if(entity.murderer && entity.type !== "Remote Runner"){
          this.drawCircle(true, entity);
        }else if(!entity.murderer){
          this.drawCircle(false, entity);
        }
      } else {
        if(!entity.murderer){
          this.drawArrow(deltaX, deltaY);
        }
      }
    }

  }

  drawCircle(blue, entity){
    if(blue){
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(0xff0000);
      this.movingGraphics.drawCircle(entity.pos.x*this.scale, -entity.pos.y*this.scale, 2);
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(0x0000ff);
    } else {
      this.movingGraphics.drawCircle(entity.pos.x*this.scale, -entity.pos.y*this.scale, 2);
    }
  }

  drawArrow(x, y){
    let centerX = this.runner.pos.x*this.scale;
    let centerY = -this.runner.pos.y*this.scale;
    let xPos = centerX;
    let yPos = centerY;
    if(Math.abs(x) > Math.abs(y)){
      if(x < 0){
        xPos = centerX + this.width/2 - 3;
        yPos = centerY - this.height/2 * Math.atan(y/x);
      } else{
        xPos = centerX - this.width/2 + 3;
        yPos = centerY - this.height/2 * Math.atan(-y/x);
      }
    } else {
      if(y > 0){
        yPos = centerY + this.height/2 - 3;
        xPos = centerX - this.width/2 * Math.atan(x/y);
      } else if(y < 0){
        yPos = centerY - this.height/2 + 3;
        xPos = centerX - this.width/2 * Math.atan(-x/y);
      } else {
        yPos = centerY;
        xPos = centerX;
      }
    }
    this.movingGraphics.drawCircle(xPos, yPos, 3);
  }

  reset(){
    this.entities = [];
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
