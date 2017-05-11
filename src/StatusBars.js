/**Class that keeps track of all entities that need to display their status*/
class StatusBars{

  /**
  * creates the status bar tracker that holds list of entities to track and where to draw
  * @constructor
  * @param {PIXI.Graphics} graphics the convas to draw the status bars on
  */
  constructor(graphics){
    this.healthBars = [];
    this.progressBars = [];
    this.graphics = graphics;
  }

  /**
  * creates a tracker that represents the player's healthBar
  * @param {Entity} entity the enitity to keep track of
  */
  addHealthBar(entity){
    let width = 120;
    let height = 5;
    let healthBar = new Tracker(entity, width, height, 70);
    this.healthBars.push(healthBar);
  }

  /**
  * creates a tracker that represents the tap count of a bear Trap
  * @param {BearTrap} element the bear trap to track
  */
  addBearTrapBar(element){
    let width = 30;
    let height = 8
    let progressBar = new Tracker(element, width, height, 40, false, 0xfffc00);
    this.progressBars.push(progressBar);
  }

  /**
  * draws the status bars on the graphics layer
  * @param {Tracker} bar the bar to draw on the canvas
  */
  draw(bar){
    this.graphics.beginFill(0xffffff);
    this.graphics.drawRect(bar.pos.x-2, bar.pos.y-2, bar.barWidth+4, bar.barHeight+4);
    this.graphics.endFill();
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(bar.pos.x, bar.pos.y, bar.barWidth, bar.barHeight);
    this.graphics.endFill();
    this.graphics.beginFill(bar.color);
    this.graphics.drawRect(bar.pos.x, bar.pos.y, bar.outerWidth, bar.barHeight);
    this.graphics.endFill();
  }

  /**
  * updates the position and status of the status bars that are currently available and draws them
  */
  update(){
    for(let bar of this.healthBars){
      bar.updatePos();
      bar.outerWidth = bar.barWidth * (bar.track.health/100);
      this.draw(bar);
    }
    for(let bar of this.progressBars){
      if(bar.track.state === "closed"){
        bar.visible = true;
      }
      else{
        bar.visible = false;
      }
      if(bar.visible){
        bar.updatePos();
        bar.outerWidth = bar.barWidth * (bar.track.tapCount/bar.track.maxTap);
        this.draw(bar);
      }
    }
  }
}

/** Class that creates a tracker that keeps track of an entity or element*/
class Tracker{
  /**
  * Creates the tracker that has an entity or element to track
  * @constructor
  * @param {Entity} entity the entity or element to keep track of
  * @param {number} width the width of the bar that is drawn
  * @param {number} height the height of the bar that is drawn
  * @param {number} yOffSet the distance the bar should be from what it is tracking
  * @param {boolean} visible true if the bar should be drawn, defaults to true
  * @param {hexadecimal} color the color of the bar to be drawn
  */
  constructor(entity, width, height, yOffSet, visible = true, color = 0xFF3300){
    this.track = entity;
    this.barWidth = width;
    this.barHeight = height;
    this.outerWidth = this.barWidth;
    this.yOffSet = yOffSet
    this.color = color;
    this.pos = {x:this.track.pos.x-this.barWidth/2, y:-this.track.pos.y-this.yOffSet};
    this.visible = visible;
  }

  /**
  * updates the position of the status bar
  */
  updatePos(){
    this.pos.x = this.track.pos.x-this.barWidth/2;
    this.pos.y = -this.track.pos.y-this.yOffSet;
  }
}

export default StatusBars;
