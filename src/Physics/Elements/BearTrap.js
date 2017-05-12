import Element from "./Element.js";

/** Creates element that is type "Trap" that collides and effects the player*/
class BearTrap extends Element{
  /**
  * Creates Trap that is rendered as a white square and can collide with runner
  * @constructor
  * @param {number} x the x-coordinates of the Trap Element
  * @param {number} y the y-coordinate of the Trap Element
  * @param {number} width the width of the Trap Element
  * @param {number} height the height of the Trap Element
  * @param {ElementDescription} element the description of the element that the image is displayed on
  */
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Bear Trap", false, 1);
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
    this.color = 0xff0022;
    this.lastVel = 0;
    this.tapCount = 0;
    this.maxTap = 30;
    this.interactive = true;

    this.hasChanged = false;
  }

  /**
  * Empty method that is called to check if collision occurs
  * @param {Entity} entity the entity that this collides with
  * @param {number} side the side where collision occurs 1=RIGHT 2=Top 3=LEFT 4=BOTTOM
  * @param {number} entityX the x-coordinate of the entity that is collided with
  * @param {number} entityY the y-coordinate of the entity that is collided with
  */
    collision(entity, side, entityX, entityY){
      if(entity.type === "Runner"){
        let runner = entity;
        if(this.state === "idle"){
          this.hasChanged = true;
          this.state = "closing";
          this.time = Date.now();
        }
        if(Date.now()- this.time > 10){
          this.hasChanged = true;
          this.state = "closed";
        }
        if(!runner.frozen){
          this.dontMoveOnCollision = true;
          runner.freeze();
        }
        if(this.tapCount <this.maxTap){
          runner.hurt(0.1);
          let vel = runner.getVelocityX();
          //console.log(vel);
          if(vel > 0 && this.lastVel != vel){
            this.lastVel = vel;
            this.tapCount++;
            this.hasChanged = true;
          }
          else if(vel < 0 && this.lastVel != vel){
            this.lastVel = vel;
            this.tapCount++;
            this.hasChanged = true;
          }
        }
        else{
          this.color = 0x00ff00;
          this.ghost = true;
          runner.unfreeze();
          this.state = "open";
          this.hasChanged = true;
        }
    }
  }

  /**
  * accepts the data which was sent over the network
  * @param {Object} data the data
  */
  accepetPacketData(data){
    this.state = data.state;
    this.tapCount = data.tapCount;
  }

  /**
  * specifies the data to be sent when hashanged is true
  */
  generatePacketData(){
    this.hasChanged = false;
    let data = {
      state: this.state,
      tapCount: this.tapCount
    }
    return data;
  }

}

export default BearTrap;
