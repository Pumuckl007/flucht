/**Class that keeps track of all entities that need to display their status*/
class StatusBars{

  /**
  * creates the status bar tracker that holds list of entities to track and where to draw
  * @param {PIXI.Stage} stage the stage to display the status bars
  * @param {PIXI.Renderer} renderer the renderer to display the status bars
  */
  constructor(stage, renderer, graphics){
    this.healthBars = [];
    this.progressBars = [];
    this.renderer = renderer;
    this.stage = stage;
    this.graphics = graphics;
  }

  addHealthBar(entity){
    let healthBar = new Tracker(entity, 128, 8, 70);
    this.healthBars.push(healthBar);
  }

  addBearTrapBar(element){
    let progressBar = new Tracker(element, 30, 8, 40, false, 0xfffc00);
    this.progressBars.push(progressBar);
  }

  draw(bar){
    this.graphics.beginFill(0x000000);
    this.graphics.drawRect(bar.pos.x, bar.pos.y, bar.barWidth, bar.barHeight);
    this.graphics.endFill();
    this.graphics.beginFill(bar.color);
    this.graphics.drawRect(bar.pos.x, bar.pos.y, bar.outerWidth, bar.barHeight);
    this.graphics.endFill();
  }

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

class Tracker{
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

  updatePos(){
    this.pos.x = this.track.pos.x-this.barWidth/2;
    this.pos.y = -this.track.pos.y-this.yOffSet;
  }
}

export default StatusBars;
