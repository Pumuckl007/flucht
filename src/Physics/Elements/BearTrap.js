import Element from "./Element.js";
import Box from "./../Box.js";

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
    console.log(x, y);
    this.state = "idle";
    if(!element){
      return;
    }
    this.element = element;
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
    this.color = 0xff0022;
    this.lastVel = 0;
    this.tapCount = 0;
    this.maxTap = 30;
    this.interactive = true;
    this.trappedEntity = -1;
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
      if(entity.type === "Runner" && (!entity.frozen || this.trappedEntity === entity)){
        if(!this.isPlayerInTrap(entity)){
          return true;
        }
        if(this.trappedEntity < 0){
          this.trappedEntity = entity;
        }
        if(this.trappedEntity === entity){
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
            let vel = Math.abs(runner.getVelocityX())/runner.getVelocityX();
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
  }

  /**
  * determins if the player is in the trap or not
  * @param {Entity} entity the entity to check
  * @return {Boolean} whether or not the entity is in the trap
  */
  isPlayerInTrap(entity){
    let dx = entity.pos.x - this.pos.x;
    let dy = (entity.pos.y - entity.box.height/2) - (this.pos.y + this.box.height/2);
    return Math.abs(dx) < 2 && Math.abs(dy) < 1;
  }

  /**
  * accepts the data which was sent over the network
  * @param {Object} data the data
  */
  accepetPacketData(data){
    this.state = data.state;
    this.tapCount = data.tapCount;
    this.trappedEntity = data.trappedEntity;
    this.ghost = data.ghost;
  }

  /**
  * specifies the data to be sent when hashanged is true
  */
  generatePacketData(){
    this.hasChanged = false;
    let data = {
      state: this.state,
      tapCount: this.tapCount,
      trappedEntity: this.trappedEntity,
      ghost : this.ghost
    }
    return data;
  }

  /**
  * clones the trap
  */
  clone(){
    let bearTrap = new BearTrap(this.pos.x, this.pos.y,
    this.box.width, this.box.height, this.element);
    bearTrap.state = this.state;
    bearTrap.url = this.url;
    bearTrap.offY = this.offY;
    bearTrap.offX = this.offX;
    bearTrap.ghost = this.ghost;
    bearTrap.color = this.color;
    bearTrap.lastVel = this.lastVel;
    bearTrap.tapCount = this.tapCount;
    bearTrap.maxTap = this.maxTap;
    bearTrap.interactive = this.interactive;
    bearTrap.trappedEntity = this.trappedEntity;
    bearTrap.hasChanged = this.hasChanged;
    return bearTrap;
  }

  /**
  * updates the values to match a json representation
  */
  fromJSON(json){
    for(let id in json){
      this[id] = json[id];
      this.box = new Box(this.box.width, this.box.height);
    }
  }

}

export default BearTrap;
