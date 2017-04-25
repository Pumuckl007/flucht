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
    super(x, y, width, height, "Bear Trap");
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
    this.color = 0xff0022;
    this.lastVel = 0;
    this.tapCount = 0;
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
        this.dontMoveOnCollision = true;
        runner.freeze();
        if(this.tapCount <20){
          let vel = runner.getVelocityX;
          if(vel > 0 && this.lastVel != vel){
            this.lastVel = vel;
            this.tapCount++;
          }
          else if(vel < 0 && this.lastVel != vel){
            this.lastVel = vel;
            this.tapCount++;
          }
        }
        else{
          this.color = 0x00ff00;
          this.ghost = true;
          runner.unfreeze();
        }
        console.log(this.tapCount);
    }
  }

}

export default BearTrap;
