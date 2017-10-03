'use strict';

/**
A class that represents a box for collision detection
*/
class Box{
  /**
  * creates A box with given width an height
  * @constructor
  * @param {number} width width of the box
  * @param {number} height height of the box
  */
  constructor(width, height){
    this.height = height;
    this.width = width;
  }

  /**
  * checks if there is a collision the box intersects another box
  * @param {Box} box the other box
  * @param {number} xOff the x offset for the other box
  * @param {number} yOff the y offset for the other box
  * @returns {boolean} returns true if the boxes are intersecting
  */
  intersects(box, xOff, yOff){
    let value = 0;
    if(Math.abs(yOff)*2 < box.height + this.height&&Math.abs(xOff)*2 < box.width + this.width){
      value = 3;
      if(this.height/2 > Math.abs(yOff)-box.height/2 && this.height/2 < Math.abs(yOff)+box.height/2){
        value --;
      }
      if(this.width/2 > Math.abs(xOff)-box.width/2 && this.width/2 < Math.abs(xOff)+box.width/2){
        value -=2;
      }
      return (value <= 0) ? 3 : value;
    }
    return value;
  }

  /**
  * returns the amount of overlap between two boxes in the x and y axis [0, width], [0, height]
  * @param {Box} box the other box
  * @param {number} xOff the x offset for the other box
  * @param {number} yOff the y offset for the other box
  * @returns {number[]} returns the x and y overlap as an array [x, y]
  */
  getOverlap(box, xOff, yOff){
    let xOver = box.width/2 - (Math.abs(xOff)-this.width/2);
    let yOver = box.height/2 - (Math.abs(yOff)-this.height/2);
    return [Math.max(xOver, 0), Math.max(yOver, 0)];
  }
}

class Entity{

  /**
  * creates an entity with the given width an height at zero zero, with zero velocity
  * @constructor
  * @param {number} width width of the entity
  * @param {number} height height of the entity
  */
  constructor(width = 1, height = 1){
    this.state = "idle";
    this.pos = {x:0, y:0};
    this.box = new Box(width, height);
    this.needsTick = false;
    this.hasPhysics = false;
    this.vel = {x:0, y:0};
    this.type = "Entity";
  }

}

class Runner extends Entity{

  /**
  * creates a new runner with width and height at x and y
  * @constructor
  * @param {number} width the width of the runner
  * @param {number} height the height of the runner
  * @param {number} x the x pos of the runner
  * @param {number} y the y pos of the runner
  */
  constructor(width, height, x=0, y=0, name = "saya", arrow = false){
    console.log(arrow);
    super(width, height);
    this.hasPhysics = true;
    this.needsTick = true;
    this.worldCollisions = true;
    this.type = "Runner";
    this.onGround = true;
    this.pos = {x:x, y:y};
    this.frozen = false;
    this.health = 100;
    this.crouching = false;
    this.jumping = false;
    this.dead = false;
    this.name = name;
    this.ghost = false;
    this.speed = 400;
    this.arrow = arrow;
  }

  /**
  * moves the entity with the given timestep
  * @param timestep the part of one second passed
  */
  update(timestep){
    if(!this.frozen){
      this.pos.x += this.vel.x*timestep;
      this.pos.y += this.vel.y*timestep;
      if(!this.ghost){
        this.vel.y -= 20;
      }
    }
    //console.log(this.vel.x);
  }

  /**
  * used to recive user input for the runner
  */
  tick(){
    if(!this.ghost && this.won){
      this.ghost = true;
    }
    if(this.ghost){
      this.frozen = false;
      if(this.jumping){
        this.vel.y = 600;
      } else if(this.crouching){
        this.vel.y = -600;
      } else {
        this.vel.y = 0;
      }
    } else {
      if(this.jumping){
        if(this.onGround){
          this.onGround = false;
          this.vel.y = 500;
        }
      }
    }
    if(Math.abs(this.vel.x) > 0){
      this.state = "running";
    } else {
      this.state = "idle";
    }
  }

  /**
  * returns the current x velecity of the runner
  * @return the velocity of runner on x axis
  */
  getVelocityX(){
    return this.vel.x;
  }

  /**
  * freezes the runner so they can not move left or right
  */
  freeze(){
    this.frozen = true;
  }

  /**
  * unfreezes the runner so they can move left or right
  */
  unfreeze(){
    this.frozen = false;
    this.vel.y = 0;
  }

  /**
  * decreases the health of the runner
  * @param {number} damage the amount of health to removeChild
  */
  hurt(damage){
    this.health -= damage;
    if(this.health < 0){
      this.dead = true;
      this.ghost = true;
      this.health = 0;
    }
  }

  /**
  * called upon a collision with a terrain element, type is the type of collision.
  * @param {TerrainElement} terrainElement the terrain element collided with
  * @param {number} type the side of which the collision occured on
  */
  collision(terrainElement, type){
    if(this.ghost){
      return true;
    }
    if(type == 2){
      this.onGround = true;
    }
    if(terrainElement.type === "Side Jump"){
      return (type === 4 || type === 1) || this.crouching;
    } else if(terrainElement.type === "Drop Down"){
      return this.crouching;
    }
  }

  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    if(this.deleted){
      return;
    }
    let speed = this.ghost ? 600 : this.speed;
    if(this.arrow){
      this.vel.x = speed*inputMethod.getXArrowMovement();
      this.jumping = inputMethod.jumpArrowPushed();
      this.crouching = inputMethod.crouchArrowHeld();
    } else {
      this.vel.x = speed*inputMethod.getXMovement();
      this.jumping = inputMethod.jumpPushed();
      this.crouching = inputMethod.crouchHeld();
    }
  }
}

/**
 * A module used for collision detection
 * @module Physics/Collisions
 */

/**
Finds any collisions between the terrain elements and the entity and calls the respective methods.
After finding a collision if the entity returns true and the terrain element returns true
the position of the entity will not be corrected, if both return false then the entity will be.
@param {Terrain} terrain the terrain who's elements to check collisiosn against.
@param {Entity} entity the entity to use for collision detection
*/
function terrainAndEntity(terrain, entity, booleanReturn){
  for(let terrainElement of terrain.elements){
    if(terrainElement.ghost){
      continue;
    }
    let xOff = terrainElement.pos.x-entity.pos.x;
    let yOff = terrainElement.pos.y- entity.pos.y;
    let side = 0;
    if((side = terrainElement.box.intersects(entity.box, xOff, yOff)) !== 0){
      let overlap = terrainElement.box.getOverlap(entity.box, xOff, yOff);
      let oldX = entity.pos.x;
      let oldY = entity.pos.y;
      let oldVelX = entity.vel.x;
      let oldVelY = entity.vel.y;
      if(overlap[0] > overlap[1]){
        side = 2;
        side += correctY(entity, terrainElement, yOff);
      } else {
        side = 1;
        side += correctX(entity, terrainElement, xOff);
      }
      //console.log(entity.vel.x +" before");
      let bool = terrainElement.collision(entity, side, oldX, oldY) || terrainElement.dontMoveOnCollision || booleanReturn;
      if(bool || entity.collision(terrainElement, side)){
        entity.pos.x = oldX;
        entity.pos.y = oldY;
        entity.vel.x = oldVelX;
        entity.vel.y = oldVelY;
      }
      if(booleanReturn){
        return true;
      }
    }
  }
  return false;
}

/**
Finds any collisions between the terrain elements and the element and calls the respective methods.
After finding a collision if the element returns true and the terrain element returns true
the position of the element will not be corrected, if both return false then the element will be.
@param {Terrain} terrain the terrain who's elements to check collisiosn against.
@param {Entity} element the entity to use for collision detection
*/
function terrainAndElement(terrain, element, booleanReturn){
  for(let terrainElement of terrain.elements){
    if(terrainElement.ghost){
      continue;
    }
    let xOff = terrainElement.pos.x-element.pos.x;
    let yOff = terrainElement.pos.y- element.pos.y;
    let side = 0;
    if((side = terrainElement.box.intersects(element.box, xOff, yOff)) !== 0){
      let overlap = terrainElement.box.getOverlap(element.box, xOff, yOff);
      let oldX = element.pos.x;
      let oldY = element.pos.y;
      if(overlap[0] > overlap[1]){
        side = 2;
        side += correctY(element, terrainElement, yOff);
      } else {
        side = 1;
        side += correctX(element, terrainElement, xOff);
      }
      //console.log(element.vel.x +" before");
      let bool = terrainElement.dontMoveOnCollision || booleanReturn;
      if(bool){
        element.pos.x = oldX;
        element.pos.y = oldY;
      }
      if(booleanReturn){
        return overlap;
      }
    }
  }
  return false;
}

/**
Corrects the x direction of the entity returning which direction it was corrected, left = 2, right = 0
@param {Entity} toMove the entity to check and to move
@param {Entity} notToMove the entity to check and not to move
@param {number} xOff the offset in the x direction of the two elements, how far further left the notToMove is.
*/
function correctX(toMove, notToMove, xOff){
  let direction = 0;
  if(xOff !== 0)
    direction = -Math.abs(xOff)/xOff;
  else
    return 0;
  if(notToMove.dontMoveCollision){
    toMove.vel.x = 0;
  }
  toMove.pos.x = notToMove.pos.x + direction*(toMove.box.width/2 + notToMove.box.width/2);
  return (direction < 0) ? 2 : 0;
}

/**
Corrects the y direction of the entity returning which direction it was corrected, down = 2, up = 0
@param {Entity} toMove the entity to check and to move
@param {Entity} notToMove the entity to check and not to move
@param {number} yOff the offset in the y direction of the two elements, how far further up the notToMove is.
*/
function correctY(toMove, notToMove, yOff){
  let direction = 0;
  if(yOff !== 0)
    direction = -Math.abs(yOff)/yOff;
  else {
    return 0;
  }
  if(toMove.vel){
    toMove.vel.y = 0;
  }
  toMove.pos.y = notToMove.pos.y + direction*(toMove.box.height/2 + notToMove.box.height/2);
  return (direction < 0) ? 2 : 0;
}

/**
* finds all of the entities which collide with the box
* @param {Box} box the box to check against
* @param {Entity[]} entities the entities to check against
* @return {Entity[]} a list of entities that collided
*/
function boxAndEntities(box, entities, x, y){
  let collided = [];
  for(let entity of entities){
    let dx = entity.pos.x - x;
    let dy = entity.pos.y - y;
    if(box.intersects(entity.box, dx, dy) && !entity.hidden && !entity.ghost){
      collided.push(entity);
    }
  }
  return collided;
}

var Collisions = {terrainAndEntity: terrainAndEntity, correctX: correctX, correctY: correctY, terrainAndElement : terrainAndElement, boxAndEntities: boxAndEntities};

class Element{
  /**
  * creates an element
  * @constructor
  * @param {number} x the x-coordinates of the element
  * @param {number} y the y-coordinate of the element
  * @param {number} width the width of the element
  * @param {number} height the height of the element
  * @param {String} type element type that is set to "Element"
  * @param {boolean} renderAsBox specifies if the element is a box or not
  * @param {number} id the id of the trap
  */
  constructor(x, y, width, height, type = "Element", renderAsBox = true, id = -1){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height); //collision hit box
    this.type = type;
    this.renderAsBox = renderAsBox; //draws this as black square
    this.color = 0x000000; // color of square
    this.id = id;
  }
  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){

  }
  /** empty method called when updating*/
  update(){

  }

}

function buildWall(start, end, x, gateways){
  let elements = [];
  if(gateways.length < 1){
    let center = (start+end)/2;
    let breath = end - start;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10));
    return elements;
  }
  let allLeft = start;
  let left = gateways[0].position;
  let right = left-1;
  for(let i = 0; i<gateways.length; i++){
    if(gateways[i].position <= right+1){
      right = gateways[i].position + gateways[i].width;
    } else {
      if(left - allLeft > 1){
        let center = (allLeft+left)/2;
        let breath = left - allLeft;
        elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10));
      }
      allLeft = right;
      left = gateways[i].position;
      right = left + gateways[i].width;
    }
  }
  if(left - allLeft > 1){
    let center = (allLeft+left)/2;
    let breath = left - allLeft;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10));
  }
  if(end - right > 1){
    let center = (end+right)/2;
    let breath = end - right;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10));
  }
  return elements;
}

class TexturedElement extends Element{
  /**
  * Creates Textured Element using element constructor and setting type to "Textured Element"
  * @constructor
  * @param {number} x the x-coordinates of the Textured Element
  * @param {number} y the y-coordinate of the Textured Element
  * @param {number} width the width of the Textured Element
  * @param {number} height the height of the Textured Element
  * @param {ElementDescription} element the description of the element that the image is displayed on
  */
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Textured Element", false);
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
  }
/**
* Empty method that is called to check if collision occurs
* @param {Entity} entity the entity that this collides with
* @param {number} side the side where collision occurs
* @param {number} entityX the x-coordinate of the entity that is collided with
* @param {number} entityY the y-coordinate of the entity that is collided with
*/
  collision(entity, side, entityX, entityY){

  }
}

class SideJump extends TexturedElement{
  /**
  * creates a Side Jump element using Element constructor and assigns type "SideJump"
  * @constructor
  * @param {number} x the x-coordinate of Side jump element
  * @param {number} y the y-coordinate of Side Jump element
  * @param {number} width width of the element
  * @param {number} height height of the element
  */
  constructor(x, y, width, height, noLongerVisible = false){
    super(x, y, width, height, {
      "x": x,
      "y": y,
      "width": width,
      "height": height,
      "type": "Textured Element",
      "url": "/assets/Stairs/Stairs.json",
      "offsetX": -32,
      "offsetY": -34
    });
    this.type = "Side Jump";
    this.needsUpdate = true;
    this.noLongerVisible = noLongerVisible;
    this.color = this.noLongerVisible ? 0xFFFFFF : 0;
  }
/**
* checks if there is a collision on side 3
* @param {Entity} entity the entity that is collided with
* @param {number} side the side where collision occurs
*/
  collision(entity, side){
    if(side === 3){
      let relFeetHeight = entity.pos.y - entity.box.height/2 - this.pos.y;
      if( relFeetHeight > -this.box.height/2-10 && relFeetHeight < this.box.height/2+10){
        entity.pos.y = this.pos.y+this.box.height/2+entity.box.height/2;
        entity.vel.y = Math.max(entity.vel.y, 0);
      }
    }
  }
}

function generator(args){
  let top = args[0];
  let height = args[1];
  let size = args[2];
  let elements = [];
  for(let i = 0; i<height/size; i++){
    let x = top-((0.5 + i)*size);
    let y = height - (0.5+i)*size;
    elements.push(new SideJump(x, y, size, size, i%4!==3));
  }
  return elements;
}

class DropDown extends Element{
  /**
  * creates DropDown object by calling Element Constructor with type "Drop Down"
  * @constructor
  * @param {number} x the x-coordinate of Drop Down element
  * @param {number} y the y-coordinate of Drop Down element
  * @param {number} width width of the element
  * @param {number} height height of the element
  */
  constructor(x, y, width, height){
    super(x, y, width, height, "Drop Down");
  }

  /**
  * checks if there is a collision on specific side of the element
  * @param {Entity} entity the entity that collides with this
  * @param {number} side the side where collision occurs
  * @param {number} entityX the x-coordinate of the entity
  * @param {number} entityY the y-coordinate of the entity
  * @returns {boolean} returns true if collision occurs on any side other than 2
  */
  collision(entity, side, entityX, entityY){
    if(side === 2){
      let relFeetHeight = entityY - entity.box.height/2 - this.pos.y;
      if( relFeetHeight > -this.box.height && relFeetHeight < this.box.height/2){
        return false;
      }
    }
    return true;
  }
}

class LitElement extends Element{
  /**
  * Creates Textured Element using element constructor and setting type to "Textured Element"
  * @constructor
  * @param {number} x the x-coordinates of the Lit Element
  * @param {number} y the y-coordinate of the Lit Element
  * @param {number} width the width of the Lit Element
  * @param {number} height the height of the Lit Element
  * @param {ElementDescription} element the description of the element that the image is displayed on
  */
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Lit Element", false);
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
  }
/**
* Empty method that is called to check if collision occurs
* @param {Entity} entity the entity that this collides with
* @param {number} side the side where collision occurs
* @param {number} entityX the x-coordinate of the entity that is collided with
* @param {number} entityY the y-coordinate of the entity that is collided with
*/
  collision(entity, side, entityX, entityY){

  }
}

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
    this.trappedEntity = false;
    this.hasChanged = false;
    this.remoteTrap = false;
  }

  /**
  * Empty method that is called to check if collision occurs
  * @param {Entity} entity the entity that this collides with
  * @param {number} side the side where collision occurs 1=RIGHT 2=Top 3=LEFT 4=BOTTOM
  * @param {number} entityX the x-coordinate of the entity that is collided with
  * @param {number} entityY the y-coordinate of the entity that is collided with
  */
    collision(entity, side, entityX, entityY){
      if(!this.isPlayerInTrap(entity) || this.remoteTrap || entity.ghost){
        return true;
      }
      if(entity.type === "Runner" && (!entity.frozen || this.trappedEntity === entity) && !this.remoteTrap){
        if(!this.trappedEntity){
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
    return Math.abs(dx) < 10 && Math.abs(dy) < 1;
  }

  /**
  * accepts the data which was sent over the network
  * @param {Object} data the data
  */
  accepetPacketData(data){
    this.state = data.state;
    this.tapCount = data.tapCount;
    this.ghost = data.ghost;
    if(!this.trappedEntity){
      this.remoteTrap = data.remoteTrap;
    }
  }

  /**
  * specifies the data to be sent when hashanged is true
  */
  generatePacketData(){
    this.hasChanged = false;
    let data = {
      state: this.state,
      tapCount: this.tapCount,
      ghost : this.ghost,
      remoteTrap : (this.trappedEntity) ? true : false,
    };
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

class Exit extends Element{

  /**
  * creates a new exit at the given x and y positions
  */
  constructor(x, y){
    super(x, y, 100, 200, "Exit");
    this.color = 0x0000FF;
    this.hiddenOnMiniMap = true;
  }

  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){
    if(entity.type === "Runner" && !entity.murderer && !entity.ghost && flucht.world.keyCollected){
      entity.won = true;
    }
    return true;
  }

}

class Key extends Element{

  /**
  * creates a new exit at the given x and y positions
  */
  constructor(x, y){
    super(x, y, 32, 32, "Key");
    this.color = 0xFFFF00;
    this.noLongerVisible = false;
    this.needsUpdate = true;
    this.hiddenOnMiniMap = true;
  }

  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){
    if(!entity.murderer && !entity.ghost){
      flucht.world.keyCollected = true;
      this.noLongerVisible = true;
    }
    return true;
  }

}

var ElementMap = {
  "Element": Element,
  "Platform": Element,
  "Side Jump": SideJump,
  "Stairs": generator,
  "Drop Down": DropDown,
  "Textured Element": TexturedElement,
  "Lit Element": LitElement,
  "Bear Trap": BearTrap,
  "Exit" : Exit,
  "Key" : Key
};

class Room{

  /**
  * creates a new room at x, y with discription discription.
  * @constructor
  * @param {number} x the x position of the room.
  * @param {number} y the y position of the room.
  * @param {Object} description the discription of the room.
  */
  constructor(x, y, description){
    this.elements = [];
    this.x = x;
    this.y = y;
    this.box = new Box(description.width + 20, description.height + 20);
    this.description = description;
    this.types = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };
  }

  /**
  * Generates the walls for a room
  */
  generateWalls(){

    let right = buildWall(0, this.box.height-20, false, this.types.right);
    this.mirror(right, false);
    let up = buildWall(-10, this.box.width-10, true, this.types.top);
    this.mirror(up, true);
    if(this.description.leftEntrance){
      let left = buildWall(0, this.box.height-20, false, [{
        "location": "left",
        "position": 0,
        "width": 200
      }]);
      this.elements = this.elements.concat(left);
    } else {
      let left = buildWall(0, this.box.height-20, false, []);
      this.elements = this.elements.concat(left);
    }
    if(this.description.rightEntrance){
      let right = buildWall(0, this.box.height-20, false, [{
        "location": "right",
        "position": 0,
        "width": 200
      }]);
      this.mirror(right, false);
      this.elements = this.elements.concat(right);
    } else {
      let right = buildWall(0, this.box.height-20, false, []);
      this.mirror(right, false);
      this.elements = this.elements.concat(right);
    }
    if(this.description.topEntrance){
      let top = buildWall(-10, this.box.width-10, true, [{
        "location": "top",
        "position": this.box.height-120,
        "width": 240
      }]);
      this.mirror(top, true);
      this.elements = this.elements.concat(top);
    } else {
      let top = buildWall(-10, this.box.width-10, true, []);
      this.mirror(top, true);
      this.elements = this.elements.concat(top);
    }
    if(this.description.bottomEntrance){
      let bottom = buildWall(-10, this.box.width-10, true, [{
        "location": "bottom",
        "position": this.box.height-120,
        "width": 240
      }]);
      this.elements = this.elements.concat(bottom);
    } else {
      let bottom = buildWall(-10, this.box.width-10, true, []);
      this.elements = this.elements.concat(bottom);
    }
    let dX = this.box.width/2-this.x;
    let dY = this.box.height/2-this.y;
    this.generateElements();
    for(let element of this.elements){
      element.pos.x -= dX;
      element.pos.y -= dY;
    }
  }

  /**
  * Generates the elements in the room
  */
  generateElements(){
    for(let element of this.description.elements){
      let built = new ElementMap[element.type](element.x, element.y, element.width, element.height, element);
      this.elements.push(built);
    }
    if(!this.description.specialElements){
      return;
    }
    for(let element of this.description.specialElements){
      let built = ElementMap[element.type](element.args);
      this.elements = this.elements.concat(built);
    }
  }

  /**
  * Mirrors an element over the x or y axis of the room.
  * @param {Element[]} elements the elements to mirror
  * @param {boolean} x whether or not the mirror is over the x-axis
  */
  mirror(elements, x){
    for(let element of elements){
      if(!x){
        element.pos.x += this.box.width-10;
      } else {
        element.pos.y += this.box.height-10;
      }
    }
  }
}

function generateLevel(urlToDescription, callback, random){
  let discription = false;
  let waitUntilDone = function(levelDiscription){
    if(!discription){
      discription = levelDiscription;
      let rooms = discription.roomTypes;
      rooms = rooms.slice(0);
      if(levelDiscription.exitRoom){
        rooms.push(levelDiscription.exitRoom.url);
      }
      if(levelDiscription.keyRoom){
        rooms.push(levelDiscription.keyRoom.url);
      }
      loadAllToCache(rooms);
    }
    if(allDoneLoadingLevels){
      generate(discription, callback, random);
    } else {
      setTimeout(waitUntilDone, 10);
    }
  };
  httpRequest(urlToDescription, waitUntilDone);
}

/**
* generates the level with the given discription and callback
* @param {LevelDiscription} levelDescription the level discription object
* @param {Room[]} levelDescription.rooms the rooms of the level
* @param {function} callback the callback
*/
function generate(levelDescription, callback, random){
  let i = levelDescription.rooms.length;
  if(levelDescription.exitRoom){
    i+=2;
  }
  let avaliableRooms = [];
  let roomMinMax = {};
  let callbackLocal = function(data, room){
    i--;

    if(levelDescription.generatorData){
      data.generatorData = levelDescription.generatorData;
    }
    if(i <= 0){
      avaliableRooms.push(data);
      roomMinMax[data.name] = room;
      build(avaliableRooms, levelDescription, callback, roomMinMax, random);
    } else {
      avaliableRooms.push(data);
      roomMinMax[data.name] = room;
    }
  };
  for(let room of levelDescription.rooms){
    httpRequest(room.url, callbackLocal, room);
  }
  if(levelDescription.exitRoom){
    httpRequest(levelDescription.exitRoom.url, callbackLocal, levelDescription.exitRoom);
    httpRequest(levelDescription.keyRoom.url, callbackLocal, levelDescription.keyRoom);
  }
}

/**
* generates the level with the given discription and callback.
* It Generates the rooms by creating a list of avaliable spots on a level, then iterating over the rooms which have minimums until
* the rooms have been placed, the leftover are filled by trying to place a rooms
* using [tryToPlace]{@link #tryToPlace} until one returns true.
* @param {RoomDiscription[]} avaliableRooms the avaliable rooms
* @param {LevelDiscription} levelDiscription the level Discription
* @param {function} callback the callback for when finished
* @param {Object} roomMinMaxMap a map between a roomName and a minimum and maximum number of that room.
*/
function build(avaliableRooms, levelDescription, callback, roomMinMaxMap, random){
  let avaliableRoomMap = {};
  let spawns = [];
  for(let room of avaliableRooms){
    avaliableRoomMap[room.name] = room;
  }

  let roomGrid = [];
  let rooms = [];
  for(let i = 0; i<levelDescription.width; i++){
    roomGrid[i] = [];
  }

  let avaliableSpots = [];
  for(let w = 0; w<levelDescription.width; w++){
    avaliableSpots.push(w);
  }
  if(levelDescription.exitRoom){
    let w = Math.floor(random()*levelDescription.width);
    let h = Math.floor(random()*levelDescription.height);
    let roomToPlace = avaliableRoomMap[levelDescription.exitRoom.name];
    tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns);
    let index = avaliableRooms.indexOf(roomToPlace);
    avaliableRooms.splice(index, 1);
  }
  if(levelDescription.keyRoom){
    while(true){
      let w = Math.floor(random()*levelDescription.width);
      let h = Math.floor(random()*levelDescription.height);
      let roomToPlace = avaliableRoomMap[levelDescription.keyRoom.name];
      if(!tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns)){
        continue;
      }
      let index = avaliableRooms.indexOf(roomToPlace);
      avaliableRooms.splice(index, 1);
      break;
    }
  }
  for(let h = 0; h<levelDescription.height; h++){
    let localAvaliableSpots = avaliableSpots.slice(0);
    for(let roomName in roomMinMaxMap){
      let min = roomMinMaxMap[roomName].min;
      if(!min){
        continue;
      }
      for(let i = 0; i<min && localAvaliableSpots.length > 0; i++){
        let index = Math.floor(random()*localAvaliableSpots.length);
        let posToPlaceAt = localAvaliableSpots[index];
        localAvaliableSpots.splice(index, 1);
        let roomToPlace = avaliableRoomMap[roomName];
        tryToPlace(roomToPlace, roomGrid, posToPlaceAt, h, levelDescription, avaliableRoomMap, rooms, spawns);
      }
    }
  }

  for(let h = 0; h<levelDescription.width; h++){
    for(let room of avaliableRooms){
      room.left = room.max;
      if(!room.max){
        room.max = 100;
        room.left = room.max;
      }
    }
    for(let w = 0; w<levelDescription.height; w++){
      if(!canPlace(w, h, levelDescription, roomGrid)){
        continue;
      }
      let localAvaliableRooms = avaliableRooms.slice(0);
      while(localAvaliableRooms.length > 0){
        let index = Math.floor(random()*localAvaliableRooms.length);
        let roomToPlace = localAvaliableRooms[index];
        localAvaliableRooms.splice(index, 1);
        if(roomToPlace.left > 0 && tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns)){
          roomToPlace.left --;
          break;
        }
      }
    }
  }

  let elements = [];

  for(let room of rooms){
    room.generateWalls();
    elements = elements.concat(room.elements);
  }

  //maxx maxy
  let bounds = [-Infinity, -Infinity];

  for(let element of elements){
    if(element.pos.x > bounds[0]){
      bounds[0] = element.pos.x;
    }
    if(element.pos.y > bounds[1]){
      bounds[1] = element.pos.y;
    }
  }

  elements = elements.concat(makeTheWalls(bounds[0]-5, bounds[1]-5));
  //console.log(levelDescription.width, levelDescription.height, "stage dimensions");
  callback(elements, rooms, spawns, levelDescription.width, levelDescription.height);
}

/**
* makes the walls
* @param {number} width the width of the level
* @param {height} height the height of the area
* @return {Element[]} a list of the elements composing the wall
*/
function makeTheWalls(width, height){
  let midX = width/2;
  let midY = height/2;
  let bottom = new Element(midX, -5, width+20, 10);
  let top = new Element(midX, height + 5, width+20, 10);
  let left = new Element(-5, midY, 10, height);
  let right = new Element(width + 5, midY, 10, height);
  return [bottom, top, left, right];
}

/**
* Tries to place a room by checking its requirements and if none are violated placing it.
* @param {RoomDiscription} roomToPlace the room's description which we are trying to place.
* @param {Room[][]} roomGrid a 2d array of rooms
* @param {number} w the width position of the room
* @param {number} h the height position of the room
* @param {LevelDiscription} levelDiscription the discription of the level
* @param {Object} avaliableRoomMap a map of names of rooms to room discriptions
* @param {Room[]} rooms a list of rooms having been placed
* @returns {boolean} returns whether or not the room was sucessfully placed
*/
function tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns){
  let can = canPlace(w, h, levelDescription, roomGrid);
  if(!can){
    return false;
  }
  for(let location in roomToPlace.roomRequirements){
    if(location === "bottom"){
      can = canPlace(w, h-1, levelDescription, roomGrid);
    } else if(location === "top"){
      can = canPlace(w, h+1, levelDescription, roomGrid);
    } else if(location === "left"){
      can = canPlace(w-1, h, levelDescription, roomGrid);
    } else if(location === "right"){
      can = canPlace(w+1, h, levelDescription, roomGrid);
    }
    if(!can){
      break;
    }
  }
  if(!can){
    return false;
  } else {
    for(let location in roomToPlace.roomRequirements){
      let roomDefinition = avaliableRoomMap[roomToPlace.roomRequirements[location]];
      if(location === "bottom"){
        let room = new Room((w+0.5)*(roomToPlace.width+20), (h-0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w][h-1] = room;
        rooms.push(room);
      } else if(location === "top"){
        let room = new Room((w+0.5)*(roomToPlace.width+20), (h+1.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w][h+1] = room;
        rooms.push(room);
      } else if(location === "left"){
        let room = new Room((w-0.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w-1][h] = room;
        rooms.push(room);
      } else if(location === "right"){
        let room = new Room((w+1.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w+1][h] = room;
        rooms.push(room);
      }
    }
  }
  let room = new Room((w+0.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomToPlace);
  roomGrid[w][h] = room;
  rooms.push(room);
  if(roomToPlace.spawn){
    let spawnX = roomToPlace.spawn.x + room.x;
    let spawnY = roomToPlace.spawn.y + room.y;
    spawns.push({x:spawnX, y:spawnY});
  }
  return true;
}

/**
* tells whether or not a room can be placed based on world size
* @param {number} x the x position of the room
* @param {number} y the y position of the room
* @param {LevelDiscription} levelDiscription the discription for the level
* @param {Room[][]} a 2d array of existing rooms
* @returns {boolean} returns whether the room would be in the world bounds.
*/
function canPlace(x, y, levelDescription, rooms){
  let can = true;
  can = can && x>=0;
  can = can && x<levelDescription.width;
  can = can && y>=0;
  can = can && y<levelDescription.height;
  can = can && !(rooms[x][y]);
  return can;
}

/**
* based on the size of the rooms tells whether one intersects any other room
* @param {Room} room the room to see if it intersects
* @param {Room[][]} rooms a 2d array of all rooms in the world
* @returns {boolean} returns whether or not the room intersects
*/
var cachedLevel = {};
var allDoneLoadingLevels = false;

/**
 * Caches all of the rooms that would be used in the level
 * @param {String[]} urls the urls to cache
 */
var loadAllToCache = function(urls){
  allDoneLoadingLevels = false;
  let numberLeft = urls.length;
  for(let url of urls){
    httpRequest(url, function(data){
      cachedLevel[url] = data;
      numberLeft --;
      if(numberLeft <= 0){
        allDoneLoadingLevels = true;
      }
    });
  }
};

/**
* makes an XMLHttpRequest with the given arguments at the url and calls the callback with the data
* @param {String} url the url to querry
* @param {Function} callback the callback function
* @param {Object} passArg the arguments to directly pass into the callback
*/
var httpRequest = function httpRequest(url, callback, passArg, random){
  if(cachedLevel[url]){
    callback(cachedLevel[url], passArg, random);
    return;
  } else {
  }
  let theHttpRequest = new XMLHttpRequest();
  theHttpRequest.onreadystatechange = function(){
    if (theHttpRequest.readyState === XMLHttpRequest.DONE) {
      if (theHttpRequest.status === 200) {
        callback(JSON.parse(theHttpRequest.responseText), passArg, random);
      }
    }
  };
  theHttpRequest.open('GET', url);
  theHttpRequest.setRequestHeader('Content-Type', 'text/json');
  theHttpRequest.send();
};

class Terrain{

  /**
  * creates a new terrain based on the url to the json discription and a handler function to call back to spawn the runner.
  * @constructor
  * @param {String} url the url which the json is located at
  * @param {Function} handler the object which has a spawn runner method that will be called once the elements are loaded
  */
  constructor(url, handler, seed = Date.now()){
    this.handler = handler;
    this.elements = [];
    this.rooms = [];
    this.width = 0;
    this.height = 0;
    this.roomWidth = 0;
    this.roomHeight = 0;
    let self = this;
    let seedFunction = new Math.seedrandom(seed);
    generateLevel(url, function(elements, rooms, spawns, width, height){self.loadElements(elements, rooms, spawns, width, height);}, seedFunction);
  }

  /**
  * callback used internally, elements are rooms are returned from the level gernerator. Calls the handler's spawn runner.
  * @param {Element[]} elements the elements that were generated
  * @param {Room[]} rooms the rooms that were generated
  */
  loadElements(elements, rooms, spawns, width, height){
    this.elements = elements;
    this.rooms = rooms;
    this.spawns = spawns;
    this.handler.spawnRunner(this);
    this.width = width;
    this.height = height;
    this.roomWidth = rooms[0].box.width;
    this.roomHeight = rooms[0].box.height;
  }

  /**
  * returns a unique id for this terrain
  */
  checksum(){
    let total = 0;
    for(let room of this.rooms){
      total += (room.x + room.y)*room.elements.length;
    }
    return total;
  }
}

class World{

  /**
  * creates a new world that loads the level "/levels/Level1.json" and calls the spawn handler when done as specified in Terrain constructor.
  * @param {Object} spawnHandler the spawn handler to have spawn runner called on
  * @param {Function} spawnHandler.spawnRunner a method that should spawn a runner
  */
  constructor(spawnHandler, seed){
    this.entities = [];
    this.seed = seed;
    this.tickingEntities = [];
    this.terrain = new Terrain("/levels/Level1.json", spawnHandler, seed);
    this.spawnHandler = spawnHandler;
    this.listeners = [];
    this.keyCollected = false;
  }

  /**
  * adds the event listener to the pool of listeners
  * @param {Object} listener the listener
  * @param {Function} listener.onEvent the function called when an even occures, called with a string and an update object.
  */
  addEventListener(listener){
    this.listeners.push(listener);
  }

  /**
  * adds a new entity to the world
  * @param {Entity} entity the entity to add
  * @param {Boolean} notifyObservers whether or not to notify listeners
  */
  addEntity(entity){
    this.entities.push(entity);
    if(entity.needsTick){
      this.tickingEntities.push(entity);
    }
    for(let listener of this.listeners){
      listener.onEvent("Entity Added", entity);
      listener.onEvent("Terrain Updated", this.terrain);
    }
  }

  /**
  * adds a new entity to the world
  * @param {Entity} element the element to add
  */
  addElement(element){
    this.terrain.elements.push(element);
    for(let listener of this.listeners){
      listener.onEvent("Element Added", element);
      listener.onEvent("Terrain Updated", this.terrain);
    }
  }

  /**
  * called when a tick occures
  * @param timestep the part of one second passed
  */
  tick(timestep){
    for(let entity of this.tickingEntities){
      entity.tick();
    }
    for(let entity of this.entities){
      if(entity.hasPhysics){
        entity.update(timestep);
      }
      if(entity.worldCollisions){
        Collisions.terrainAndEntity(this.terrain, entity);
      }
    }
  }

  /**
  * retursn if the entity collides with the terrain
  * @param {Element} element the element to check against
  * @return {Boolean} whether or not the terrain collides with the element
  */
  doesTerrainCollide(element){
    return Collisions.terrainAndElement(this.terrain, element, true);
  }

  /**
  * resets the world
  * @param {String} seed the seed to use if blank uses prior seed
  */
  reset(seed){
    this.keyCollected = false;
    this.seed = seed;
    for(let listener of this.listeners){
      listener.onEvent("Reset");
    }
    this.entities = [];
    if(window.flucht.runner){
      this.entities.push(window.flucht.runner);
    }
    let self = this;
    this.terrain = new Terrain("/levels/Level1.json", {spawnRunner:function(data){
      let first = true;
      for(let listener of self.listeners){
        listener.onEvent("Terrain Updated", self.terrain);
        if(first){
          self.spawnHandler.spawnRunner(data);
          first = false;
        }
        listener.onEvent("Entity Added", window.flucht.runner);
      }
    }} , this.seed);
  }

  /**
  * deals damage to all of the elements in the section
  * @param {Box} box the box to collide with
  * @param {Number} amount the amount of damage
  * @param {Entity} emitter the emitter to no do damage to
  */
  dealDamage(box, amount, emitter, x, y){
    let hits = Collisions.boxAndEntities(box, this.entities, x, y);
    for(let hit of hits){
      if(hit !== emitter && hit.hurt){
        hit.hurt(amount);
      }
    }
  }
}

/** Animates the entities that move in the stage*/
class AnimatedEntityRenderer{
  /**
  * Retrieves the frames of the character animations
  * @constructor
  * @param {Entity} entity the character that is to be animated
  * @param {String} url the location of the images of the character
  * @param {boolean} mirrorBasedOnVel the direction character faces based on their velocity
  */
  constructor(entity, url, mirrorBasedOnVel = false){
    this.entity = entity;
    this.lastDirection = 1;
    this.httpRequest = new XMLHttpRequest();
    this.mirrorBasedOnVel = mirrorBasedOnVel;

    let self = this;
    this.httpRequest.onreadystatechange = function(){self.finish();};
    this.httpRequest.open('GET', url);
    this.httpRequest.setRequestHeader('Content-Type', 'text/json');
    this.httpRequest.send();
    this.animations = {};
  }
  /**
  * puts images of the sprite in an array of images to be animated
  */
  finish(){
    if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
      if (this.httpRequest.status === 200) {
        if(this.httpRequest.responseText.trim() === ""){
          return;
        }
        this.data = JSON.parse(this.httpRequest.responseText);
        for(let animation of this.data.animations){
          let images = [];
          images.frameDuration = animation.frameDuration;
          this.animations[animation.name] = images;
          for(let i = animation.range[0]; i<= animation.range[1]; i++){
            let url = this.data.base + animation.path + i + animation.extention;
            images.push(PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST));
          }
        }
        this.sprite = new PIXI.Sprite(this.animations[this.data.default][0]);
        this.index = 0;
        this.animation = this.data.default;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.data.default].frameDuration/16;
        this.delayLeft = this.delay;
        this.needToAdd = true;
      }
    }
  }
/**
* updates the stage and the location of the character
* @param {Container} stage the level where the game is being played
*/
  update(stage){
    if(this.needToAdd){
      stage.addChild(this.sprite);
    }
    if(!this.sprite){
      return;
    }
    this.sprite.position.x = this.entity.pos.x-this.sprite.width/2;
    this.sprite.position.y = -this.entity.pos.y-74;
    this.sprite.scale.x = this.entity.box.width/this.data.width;
    this.sprite.scale.y = this.entity.box.width/this.data.width;
    if(this.mirrorBasedOnVel){
      let mirror = (this.entity.vel.x > 0) ? -1 : 1;
      let inverseMirror = (this.entity.vel.x < 0) ? -1 : 1;
      this.sprite.scale.x *= (mirror !== inverseMirror) ? mirror : this.lastDirection;
      this.lastDirection = (mirror !== inverseMirror) ? mirror : this.lastDirection;
      this.sprite.position.x += (this.sprite.scale.x < 0) ? this.sprite.width : 0;
    }
    this.delayLeft --;
    if(this.animation !== this.entity.state){
      if(this.animations[this.entity.state]){
        this.delayLeft = 0;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.entity.state].frameDuration/16;
        this.animation = this.entity.state;
      }
    }
    if(this.delayLeft < 0){
      this.index ++;
      if(this.index >= this.animations[this.animation].length){
        this.index = 0;
      }
      this.sprite.texture = this.animations[this.animation][this.index];
      this.delayLeft = this.delay;
    }
    this.sprite.alpha = (this.entity.ghost) ? 0.6 : ((this.entity.hidden === true) ? 0 : 1);
  }
}

/** Creates animated texture for any animated element that does not move in the stage*/
class AnimatedTexture{
  /**
  * Finds the image frames from the given url
  * @constructor
  * @param {String} url location of the background images
  * @param {number} x x-coordinate of texture
  * @param {number} y y-coordinate of texture
  * @param {function} done adds child to the stage
  */
  constructor(url, x, y, done, element){
    this.x = x;
    this.y = y;

    let self = this;

    if(!httpCache[url]){
      httpCache[url] = [this];
      this.httpRequest = new XMLHttpRequest();
      this.httpRequest.onreadystatechange = function(){
        if (self.httpRequest.readyState === XMLHttpRequest.DONE) {
          if (self.httpRequest.status === 200) {
            for(let obj of httpCache[url]){
              obj.finish(self.httpRequest.responseText);
            }
            httpCache[url] = false;
          }
        }
      };
      this.httpRequest.open('GET', url);
      this.httpRequest.setRequestHeader('Content-Type', 'text/json');
      this.httpRequest.send();
    } else {
      httpCache[url].push(this);
    }

    this.animations = {};
    this.done = done;
    if(element){
      this.element = element;
    }
  }

  /**
  * adds images to array to be animated
  */
  finish(res){
    this.data = JSON.parse(res);
    for(let animation of this.data.animations){
      let images = [];
      images.frameDuration = animation.frameDuration;
      this.animations[animation.name] = images;
      for(let i = animation.range[0]; i<= animation.range[1]; i++){
        let url = this.data.base + animation.path + i + animation.extention;
        if(!cache[url]){
          cache[url] = PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST);
        }
        images.push(cache[url]);
      }
    }
    this.sprite = new PIXI.Sprite(this.animations[this.data.default][0]);
    this.index = Math.floor(Math.random()*this.animations[this.data.default].length);
    this.animation = this.data.default;
    //UPDATE VALUE 60FPS right now
    this.delay = this.animations[this.data.default].frameDuration/16;
    this.delayLeft = this.delay;
    this.sprite.scale.x = this.data.scaleX;
    this.sprite.scale.y = this.data.scaleY;
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;
    this.done(this);
  }
/**
* updates the animated image
*/
  update(){
    if(!this.sprite){
      return;
    }
    this.delayLeft --;
    if(this.delayLeft < 0){
      this.index ++;
      if(this.index >= this.animations[this.animation].length){
        this.index = 0;
      }
      this.sprite.texture = this.animations[this.animation][this.index];
      this.delayLeft = this.delay;
    }
    if(!this.element){
      return;
    }
    if(this.element.noLongerVisible){
      this.sprite.visible = false;
      return;
    }
    if(this.animation !== this.element.state){
      if(this.animations[this.element.state]){
        this.delayLeft = 0;
        //UPDATE VALUE 60FPS right now
        this.delay = this.animations[this.element.state].frameDuration/16;
        this.animation = this.element.state;
      }
    }
  }
}

let cache = {};
let httpCache = {};

/** Class representing light source entity that moves and follows other Enities and textures*/
class LightSource{
  /**
  * Creates the light source with sprite to follow
  * @constructor
  * @param {Object}  follow Entity or element containing the position of the sprite
  * @param {Sprite} sprite the light image that the Light Source moves
  * @param {boolean} pulse true if the light source is not a runner and light needs to pulse
  */
  constructor(follow, sprite, pulse){
    this.follow = follow;
    this.sprite = sprite;
    this.pulse = pulse;
    this.pulseValue = 0.005;
    this.offsetX = 0;
    this.offsetY = 0;
    //this.pos = {x:this.follow.pos.x, y:this.follow.pos.y};
  }

  // scale(scale){
  //   this.sprite.scale.x = this.sprite.scale.y = scale;
  //   //this.offsetX = -this.sprite.width * (1-scale);
  //   //console.log(this.sprite.position.x)
  // }

  /**
  * update location of light
  */
  update(){
    //console.log("update");
    this.sprite.position.x = this.follow.pos.x - this.sprite.width/2 + this.offsetX;
    this.sprite.position.y = -this.follow.pos.y - this.sprite.height/2 + this.offsetY;
    if(this.pulse){
      if(this.sprite.alpha >= 1){
        this.pulseValue *= -1;
      }
      if(this.sprite.alpha <= 0.8){
        this.pulseValue *= -1;
      }
      this.sprite.alpha += this.pulseValue;
    }
  }
}

class LightingMask{
    /**
    * Creates a canvas layer over the game that darkens the enviorment and lighens up certain areas
    * @constructor
    * @param {PIXI.Container} stage the stage that the game is played on
    * @param {PIXI.Renderer} renderer the renderer of the game
    */
    constructor(stage, renderer, noMovement = false){
      this.noMovement = noMovement;
      this.runner = false;
      this.lightSources = [];
      this.draw = renderer;
      this.baseStage = stage;
      this.daylight = new PIXI.Graphics();
			//Set this.daylight color to shade from Black to White (dont use alpha coz it doesnt blend well)
			this.daylight.beginFill(0x0B0B0B);
			//Draw a rectangle for daylight (size of stage)
			//this.daylight.drawRect(0, 0, this.width, this.height);
			//Create a container for lights, a texture will be made from this later
			this.lights = new PIXI.Container();
      this.lightEntities = new PIXI.Container();
			//Use ADDITIVE blend modes so lights merge nicely.
			this.daylight.blendMode = PIXI.BLEND_MODES.ADD;
      this.lights.addChild(this.daylight);
      this.lights.addChild(this.lightEntities);
			//Create a texture where lights will be rendered to
			//this.texture = new PIXI.RenderTexture.create(this.width,this.height);
			//this.lightsTex = new PIXI.Sprite(this.texture);
			//Render the light texture
			//this.draw.render(this.lights, this.texture);
			//this.baseStage.mask = this.lightsTex;
			this.draw.roundPixels = true;
      this.active = true;
    }

    /**
    * adds the runner
    * @param {Runner} runner the player character in the center of the screen
    */
    addRunner(runner){
      this.runner = runner;
    }

    /**
    * updates the size of the maskinging layer to fit the size of the window
    */
    resize(){
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.daylight.clear();
      // this.daylight.beginFill(0x0B0B0B);
      this.daylight.drawRect(0, 0, this.width, this.height);
      // let oldTexture = this.texture;
      // this.texture = new PIXI.RenderTexture.create(this.width, this.height);
      if(this.texture){
        this.texture.resize(this.width, this.height);
        this.lightsTex = new PIXI.Sprite(this.texture);
        this.baseStage.mask = this.lightsTex;
      } else {
        this.texture = new PIXI.RenderTexture.create(this.width, this.height);
        this.lightsTex = new PIXI.Sprite(this.texture);
        this.baseStage.mask = this.lightsTex;
      }
    }

    /**
    * called to clear all of the lights from the lighting mask
    */
    clear(){
      this.lightSources = [];
      this.lightEntities.removeChildren();
    }

    scaleLight(scale){
      // for(let lightSource of this.lightSources){
      //   lightSource.scale(scale);
      //   lightSource.update();
      // }
      this.lights.scale.x = this.lights.scale.y = scale;
    }

    /**
    * Adds new light source to the stage that follows sprite
    * @param {object} follow the entity or element that light follows
    */
    addLightSource(follow){
      //console.log("test, Lightmask.js:52");
      let newLight = new PIXI.Sprite(PIXI.Texture.fromImage("/assets/Vignette/VignetteLight.png", false, PIXI.SCALE_MODES.NEAREST));
      newLight.position.x = follow.pos.x - newLight.width/2;
      newLight.position.y = follow.pos.y - newLight.height/2;
      newLight.blendMode = PIXI.BLEND_MODES.ADD;
      this.lightEntities.addChild(newLight);
      let pulse = true;
      if(follow.type === "Runner"){
        pulse = false;
      }
      let source = new LightSource(follow, newLight, pulse);
      this.lightSources.push(source);
    }

    /**
    * updates the position of the lights according to all light sources
    */
    animate() {
      if(this.first){
        return;
      }
      if(this.runner && !this.noMovement){
        this.lightEntities.y = this.runner.pos.y+window.innerHeight/2;
        this.lightEntities.x = -this.runner.pos.x+window.innerWidth/2;
      } else if(this.noMovement){
        this.lightEntities.y = 438/2 + window.innerHeight/2;
        this.lightEntities.x = 832/2;
      }
      for(let light of this.lightSources){
        light.update();
      }
      this.draw.render(this.lights, this.texture);
    }

    /**
    * enables the lighting mask
    */
    enable(){
      if(!this.active){
        this.daylight.beginFill(0x0B0B0B);
        this.daylight.clear();
        this.daylight.drawRect(0, 0, this.width, this.width);
      }
      this.active = true;
    }

    /**
    * disables the lighting mask
    */
    disable(){
      if(this.active){
        this.daylight.beginFill(0xFFFFFF);
        this.daylight.clear();
        this.daylight.drawRect(0, 0, this.width, this.height);
      }
      this.active = false;
    }
}

/**Class that keeps track of all entities that need to display their status*/
class StatusBars{

  /**
  * creates the status bar tracker that holds list of entities to track and where to draw
  * @constructor
  * @param {PIXI.Graphics} graphics the convas to draw the status bars on
  */
  constructor(container){
    this.healthBars = [];
    this.progressBars = [];
    this.barLayer = container;
    this.graphics = new PIXI.Graphics();
    this.barLayer.addChild(this.graphics);
  }

  /**
  * creates a tracker that represents the player's healthBar
  * @param {Entity} entity the enitity to keep track of
  */
  addHealthBar(entity){
    let width = 120;
    let height = 5;
    var style = new PIXI.TextStyle({
      fill: 0xffffff,
      fontSize: 18
    });
    var text = new PIXI.Text(entity.name, style);
    this.barLayer.addChild(text);
    let healthBar = new Tracker(entity, width, height, 70, text);
    this.healthBars.push(healthBar);
  }

  /**
  * creates a tracker that represents the tap count of a bear Trap
  * @param {BearTrap} element the bear trap to track
  */
  addBearTrapBar(element){
    let width = 30;
    let height = 8;
    let progressBar = new Tracker(element, width, height, 40, null, false, 0xfffc00);
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
    this.graphics.clear();
    for(let bar of this.healthBars){
      if(!bar.visible){
        continue;
      }
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

  /**
  * delets this
  */
  deleteStatusBar(){
    for(let bar of this.healthBars){
      bar.delete();
    }
    this.graphics.visible = false;
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
  constructor(entity, width, height, yOffSet, text, visible = true, color = 0xFF3300){
    this.track = entity;
    this.barWidth = width;
    this.barHeight = height;
    this.outerWidth = this.barWidth;
    this.yOffSet = yOffSet;
    this.color = color;
    this.pos = {x:this.track.pos.x-this.barWidth/2, y:-this.track.pos.y-this.yOffSet};
    this.visible = visible;
    this.text = text;
  }

  /**
  * updates the position of the status bar
  */
  updatePos(){
    if(this.track.hidden){
      this.delete();
    }
    this.pos.x = this.track.pos.x-this.barWidth/2;
    this.pos.y = -this.track.pos.y-this.yOffSet;
    if(this.text){
      this.text.x = this.pos.x;
      this.text.y = this.pos.y-this.text.height;
    }
  }

  delete(){
    this.visible = false;
    this.text.visible = false;
  }
}

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
    this.exitPos = {x: 0, y:0};
    this.oneXOneBox = new Box(1,1);
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
        if(room.description.name === "Exit Room"){
          this.exitPos = {x: room.x, y:room.y};
        }
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
    if(this.runner){
      let deltaX = (this.runner.pos.x*this.scale) - this.exitPos.x*this.scale;
      let deltaY = (this.runner.pos.y*this.scale) - this.exitPos.y*this.scale;
      if(this.playerBox.intersects(this.stageBox, deltaX, deltaY)){
          this.drawCircle(true, {pos:this.exitPos}, 0x00FF00);
      } else {
          this.drawArrow(deltaX, deltaY, 0x00FF00);
      }
    }
    for(let entity of this.entities){
      if(entity.hidden){
        continue;
      }
      if(this.runner){
        let deltaX = (this.runner.pos.x*this.scale) - entity.pos.x*this.scale;
        let deltaY = (this.runner.pos.y*this.scale) - entity.pos.y*this.scale;
        if(this.playerBox.intersects(this.stageBox, deltaX, deltaY)){
          if(entity.murderer && entity.type !== "Remote Runner"){
            this.drawCircle(true, entity, 0xff0000);
          }else if(!entity.murderer){
            this.drawCircle(false, entity);
          }
        } else {
          if(!entity.murderer){
            this.drawArrow(deltaX, deltaY, 0x0000FF);
          }
        }
      }
    }
  }

  drawCircle(blue, entity, color){
    if(blue){
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(color);
      this.movingGraphics.drawCircle(entity.pos.x*this.scale, -entity.pos.y*this.scale, 2);
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(0x0000ff);
    } else {
      this.movingGraphics.drawCircle(entity.pos.x*this.scale, -entity.pos.y*this.scale, 2);
    }
  }

  drawArrow(x, y, color){
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
    if(color){
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(color);
      this.movingGraphics.drawCircle(xPos, yPos, 3);
      this.movingGraphics.endFill();
      this.movingGraphics.beginFill(0x0000ff);
    } else {
      this.movingGraphics.drawCircle(xPos, yPos, 3);
    }
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

class Renderer{
  /**
  * Creates the render object and creates and prepares the stage to be drawn on
  * @constructor
  * @param {Runner} runner the player
  */
  constructor(noMovement = false){
    this.noMovement = noMovement;
    this.runner = false;
    this.typeMap = {};
    this.stage = new PIXI.Container();
    this.hud = new PIXI.Container();
    this.gameScene = new PIXI.Container();
    this.gameScene.addChild(this.stage);
    this.gameScene.addChild(this.hud);
    this.placementLayer = new PIXI.Container();
    this.gameScene.addChild(this.placementLayer);
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);//new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
    this.renderers = [];
    this.renderer.backgroundColor = 0x101010;
    this.graphics = new PIXI.Graphics();
    this.scale = 1;
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
    initMap(this.typeMap);
    let self = this;
    window.onresize = function(event){ self.resize(event);};
    this.numRunners = 0;

    this.light = new LightingMask(this.stage, this.renderer, this.noMovement);
    this.barLayer = new PIXI.Container();
    this.statusBars = new StatusBars(this.barLayer);
    this.miniMap = new MiniMap(this.renderer, this.hud);
    this.windowBox = new Box(window.innerWidth, window.innerHeight);

    this.backgroundSprites = [];
    this.backgroundBoxes = [];
    this.needsResize = false;
    this.cooldown = 0;
    this.spritesAdded = false;
  }

  setNoMovement(noMovement){
    this.noMovement = noMovement;
    this.light.noMovement = noMovement;
  }

  /**
  * adds a sprite to the placement layer
  * @param {Sprite} sprite the sprite to add
  */
  addPlacementSprite(sprite){
    this.placementLayer.addChild(sprite);
  }

 /**
 * Checks if Entity is added, terain is updated or if level is Loaded
 * @param {String} type the event that is passed
 * @param {Object} object the entity, terrian or level that is added in the event
 */
  onEvent(type, object){
    if(type === "Entity Added"){
      this.spritesAdded = true;
      let entityType = object.type;
      if(object.murderer){
        entityType = "Murderer";
      }
      let renderer = new AnimatedEntityRenderer(object, this.typeMap[entityType], true);
      if(object.type === "Runner" || object.type === "Murderer"){
        this.light.addLightSource(object);
        this.statusBars.addHealthBar(object);
        if(this.miniMap){
          this.miniMap.addEntity(object);
        }
      }
      if(object.type === "Remote Runner"){
        this.statusBars.addHealthBar(object);
        if(this.miniMap){
          this.miniMap.addEntity(object);
        }
      }
      this.renderers.push(renderer);
      //console.log(object.id);
    }
    if(type === "Terrain Updated"){
      this.terrain = object;
      //console.log(this.terrain.width, this.terrain.height, "rooms");
      if(this.miniMap){
        this.miniMap.updateTerrain(this.terrain);
      }
    }
    if(type === "Element Added"){
      let element = object;
      if(element.type === "Textured Element" || element.type === "Lit Element"|| element.interactive || element.type === "Side Jump"){
        let self = this;
        let done = function(animatedTexture){
          self.stage.addChild(animatedTexture.sprite);
          self.renderers.push(animatedTexture);
          self.spritesAdded = true;
        };
        if(element.type === "Lit Element"){
          this.light.addLightSource(element);
        }
        if(element.interactive || element.needsUpdate){
          this.statusBars.addBearTrapBar(element);
        }
        if(element.interactive){
          new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done, element);
        } else {
          new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done);
        }
      }
    }
    if(type === "Reset"){
      for(let renderer of this.renderers){
        if(renderer.sprite)
          this.graphics.removeChild(renderer.sprite);
      }
      if(this.miniMap){
        this.miniMap.reset();
      }
      this.statusBars.deleteStatusBar();
      this.statusBars = new StatusBars(this.barLayer);
      this.light.clear();
      this.stage.removeChildren();
      this.renderers = [];
      this.backgroundSprites = [];
      this.backgroundBoxes = [];
    }
    if(type === "Level Loaded"){
      let first = true;
      this.spritesAdded = true;
      for(let room of this.terrain.rooms){
        if(!backgroundCache[room.description.background]){
          backgroundCache[room.description.background] = PIXI.Texture.fromImage(room.description.background, false, PIXI.SCALE_MODES.NEAREST);
        }
        let sprite = new PIXI.Sprite(backgroundCache[room.description.background]);
        sprite.position.x = room.x-room.box.width/2;
        sprite.position.y = -room.y-room.box.height/2+10;
        sprite.scale.x = 2;
        sprite.scale.y = 2;
        this.stage.addChild(sprite);
        sprite.visible = first;
        first = false;
        this.backgroundSprites.push(sprite);
        this.backgroundBoxes.push(room.box);
      }
      this.stage.addChild(this.graphics);
      this.stage.addChild(this.barLayer);
      for(let element of this.terrain.elements){
        if(element.type === "Textured Element" || element.type === "Lit Element"|| element.interactive || element.type === "Side Jump"){
          let self = this;
          let done = function(animatedTexture){
            self.stage.addChild(animatedTexture.sprite);
            self.renderers.push(animatedTexture);
            self.spritesAdded = true;
          };
          if(element.type === "Lit Element"){
            this.light.addLightSource(element);
          }
          if(element.interactive){
            this.statusBars.addBearTrapBar(element);
          }
          if(element.interactive || element.needsUpdate){
            new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done, element);
          } else {
            new AnimatedTexture(element.url, element.pos.x-element.box.width/2+element.offX, -element.pos.y-element.box.height/2+element.offY, done);
          }
        }
      }
      this.light.resize();
    }
  }
 /**
 * Resizes the stage when the window is resized
  @param {resizeEvent} event the resizeEvent
 */
  resize(event){
    if(!this.needsResize){
      this.needsResize = true;
      this.cooldown = 1;
    }
  }

  /**
  * called when elements added to update the bars
  */
  doBarPlacement(){
    if(this.spritesAdded){
      this.stage.removeChild(this.barLayer);
      this.stage.addChild(this.barLayer);
      this.spritesAdded = false;
    }
  }

  /**
  * actually does the resize
  */
  doResize(){
    document.body.style.height = window.innerHeight + "px";
    this.renderer.resize(window.innerWidth, window.innerHeight);
    this.light.resize();
    this.windowBox = new Box(window.innerWidth, window.innerHeight);
  }

  /**
  * adds the runner to the renderer
  * @param {Runner} runner the player character in the center of the screen
  */
  addRunner(runner){
    this.runner = runner;
    this.light.addRunner(runner);
    if(this.miniMap){
      this.miniMap.addRunner(runner);
    }
  }

  /**
  * positions the stage and updates it
  */
  render(){
    this.doBarPlacement();
    if(this.needsResize){
      this.cooldown --;
      if(this.cooldown < 0){
        this.needsResize = false;
        this.doResize();
      }
    }
    if(this.runner && !this.runner.deleted){
      this.stage.y = this.scale*this.runner.pos.y+window.innerHeight/2;
      this.stage.x = -this.scale*this.runner.pos.x+window.innerWidth/2;
    } else if(this.noMovement) {
      this.stage.y = 438/2 + window.innerHeight/2;
      this.stage.x = 832/2;
    }
    if(this.background){
      this.background.update(this.stage.x, this.stage.y);
    }
    if(!this.initilized){
      this.initilized = true;
      document.body.appendChild(this.renderer.view);
    }
    for(let renderer of this.renderers){
      renderer.update(this.stage);
    }
    this.statusBars.update();
    this.light.animate();
    this.graphics.clear();
    this.graphics.beginFill(0x000000);
    if(!this.terrain){
      return;
    }
    this.cullBackgrounds();
    let x = -(this.stage.x - window.innerWidth/2)/this.scale;
    let y = (this.stage.y - window.innerHeight/2)/this.scale;
    for(let element of this.terrain.elements){
      if(element.renderAsBox && element.box.intersects(this.windowBox, x-element.pos.x, y - element.pos.y)){
        this.graphics.beginFill(element.color);
        this.graphics.drawRect(element.pos.x-element.box.width/2,
          -element.pos.y-element.box.height/2,
          element.box.width,
          element.box.height);
      }
    }
    if(this.miniMap){
      this.miniMap.update();
    }
  //  console.log("hud", this.hud.x, this.hud.y);
    //console.log("stage", this.stage.x, this.stage.y);
    this.renderer.render(this.gameScene);
  }


  /**
  * culls the backgroundSprites
  */
  cullBackgrounds(){
    let x = -(this.stage.x - window.innerWidth/2)/this.scale;
    let y = -(this.stage.y - window.innerHeight/2)/this.scale;
    for(let i = 0; i<this.backgroundSprites.length; i++){
      let sprite = this.backgroundSprites[i];
      let box = this.backgroundBoxes[i];
      let deltaX = sprite.x + box.width/2 - x;
      let deltaY = sprite.y + box.height/2 - 10 - y;
      sprite.visible = box.intersects(this.windowBox, deltaX, deltaY);
    }
  }

  /**
  * sets the x and y position of the stage
  * @param {number} x the x position
  * @param {number} y the y position
  */
  setPos(x, y){
    this.stage.y = this.scale*y+window.innerHeight/2;
    this.stage.x = -this.scale*x+window.innerWidth/2;
  }

  /**
  * enables the lighting
  */
  enableLighting(){
    this.light.enable();
  }

  /**
  * disables the lighting
  */
  disableLighting(){
    this.light.disable();
  }
}

/**
* The map relays the name of an entity to Json assets
* @param {map} map the map to be initionalized
*/
function initMap(map){
  map["Runner"] = "assets/Runner/Runner.json";
  map["Remote Runner"] = "assets/Runner/Runner.json";
  map["Murderer"] = "assets/Murderer/Murderer.json";
}

let backgroundCache = {};

/**
* a class used to get all the input values from the Keyboard and mouse
*/
class KMInputMethod{

  constructor(){
    this.keys = [];
    this.listeners = [];
    let self = this;
    window.onkeyup = function(e) {
      self.keys[e.keyCode] = false;
    };
    window.onkeydown = function(e) {
      self.keys[e.keyCode] = true;
    };

    this.cursor = {
      x : 0,
      y : 0,
      clicked : false,
      target: ""
    };

    this.stabDebounce = true;

    document.getElementById("Body").onmousemove = function(e){
      self.onMouseMove(e);
    };
    document.getElementById("Body").onclick = function(e){
      self.onClick(e);
    };
  }

  /**
  * call to add an input listener
  * @param {Object} listener the listener Object
  * @param {Function} listener.onInput this function is called when the input updates
  */
  addInputListener(listener){
    this.listeners.push(listener);
  }

  /**
  * called when clicked
  */
  onClick(e){
    this.cursor.click = true;
    this.cursor.target = e.target.id;
  }

  /**
  * called when mouse moves
  */
  onMouseMove(e){
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  }

  /**
  * polls the inputs and emits any events
  */
  poll(){
    for(let listener of this.listeners){
      listener.onInput(this);
    }
  }

  getXMovement(){
    if(this.keys[65]){
      return -1;
    } else if(this.keys[68]){
      return 1;
    } else {
      return 0;
    }
  }

  getXArrowMovement(){
    if(this.keys[37]){
      return -1;
    } else if(this.keys[39]){
      return 1;
    } else {
      return 0;
    }
  }

  getYMovement(){
    if(this.keys[83]){
      return -1;
    } else if(this.keys[87]){
      return 1;
    } else {
      return 0;
    }
  }

  jumpPushed(){
    return this.keys[32] || this.keys[87];
  }

  jumpArrowPushed(){
    return this.keys[38];
  }

  crouchHeld(){
    return this.keys[83];
  }

  crouchArrowHeld(){
    return this.keys[40];
  }

  getHotbarPosSet(){
    for(let key = 48; key<58; key++){
      if(this.keys[key]){
        let index = key - 48;
        if(index === 0){
          index = 10;
        }
        index --;
        return index;
      }
    }
    return false;
  }

  getHotbarPosDelta(){
    return 0;
  }

  getCursor(){
    let clone = {
      x: this.cursor.x,
      y: this.cursor.y,
      click: this.cursor.click,
      target: this.cursor.target
    };
    this.cursor.click = false;
    return clone;
  }

  getStartButton(){
    return false;
  }

  isStabbing(){
    return this.keys[81];
  }

}

/**
* a class used to get all the input values from a controller
*/
class ControllerInputMethod{

  constructor(id){
    this.id = id;
    this.gamePad = navigator.getGamepads()[id];
    this.listeners = [];

    this.leftDebouce = true;
    this.rightDebouce = true;

    this.cursor = {
      x : window.innerWidth/2,
      y : window.innerHeight/2,
      clicked : false,
      unClicked : true,
      target: ""
    };
    this.jump = 0;
    this.crouch = 10;
    this.click = 11;
    this.attack = 2;
    this.start = 9;
    this.hotBarPlus = 5;
    this.hotBarMinus = 4;
  }

  /**
  * call to add an input listener
  * @param {Object} listener the listener Object
  * @param {Function} listener.onInput this function is called when the input updates
  */
  addInputListener(listener){
    this.listeners.push(listener);
  }

  /**
  * called when clicked
  */
  onClick(e){
    this.cursor.click = true;
    this.cursor.target = e.target.id;
  }

  /**
  * called when mouse moves
  */
  onMouseMove(e){
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  }

  /**
  * polls the inputs and emits any events
  */
  poll(){
    this.gamePad = navigator.getGamepads()[this.id];
    let xAxis = this.gamePad.axes[2];
    if(Math.abs(xAxis) < 0.2){
      xAxis = 0;
    }
    let yAxis = this.gamePad.axes[3];
    if(Math.abs(yAxis) < 0.2){
      yAxis = 0;
    }
    if(xAxis !== 0){
      this.cursor.x += 10*Math.abs(xAxis)/xAxis*Math.pow(xAxis, 2);
    }
    if(yAxis !== 0){
      this.cursor.y += 10*Math.abs(yAxis)/yAxis*Math.pow(yAxis, 2);
    }
    if(this.cursor.x < 0){
      this.cursor.x = 0;
    }
    if(this.cursor.y < 0){
      this.cursor.y = 0;
    }
    if(this.cursor.x > window.innerWidth){
      this.cursor.x = window.innerWidth;
    }
    if(this.cursor.y > window.innerHeight){
      this.cursor.y = window.innerHeight;
    }
    if(this.cursor.unclicked && this.gamePad.buttons[this.click].pressed){
      this.cursor.click = true;
      this.cursor.unclicked = false;
    }
    if(!this.gamePad.buttons[this.click].pressed && !this.cursor.unclicked){
      this.cursor.unclicked = true;
      this.cursor.click = false;
    }
    this.cursor.target = "MurderEditor";
    for(let listener of this.listeners){
      listener.onInput(this);
    }
  }

  getXMovement(){
    let xAxis = this.gamePad.axes[0];
    if(Math.abs(xAxis) > 0.2){
      return xAxis;
    }
    return 0;
  }

  getYMovement(){
    let yAxis = -this.gamePad.axes[1];
    if(Math.abs(yAxis) > 0.2){
      return yAxis;
    }
    return 0;
  }

  jumpPushed(){
    return this.gamePad.buttons[this.jump].pressed;
  }

  crouchHeld(){
    return this.gamePad.buttons[this.crouch].pressed;
  }

  getHotbarPosSet(){
    return false;
  }

  getHotbarPosDelta(){
    let delta = 0;
    if(this.gamePad.buttons[this.hotBarPlus].pressed && this.rightDebouce){
      this.rightDebouce = false;
      delta += 1;
    }
    if(!this.gamePad.buttons[this.hotBarPlus].pressed){
      this.rightDebouce = true;
    }
    if(this.gamePad.buttons[this.hotBarMinus].pressed && this.leftDebouce){
      this.leftDebouce = false;
      delta -= 1;
    }
    if(!this.gamePad.buttons[this.hotBarMinus].pressed){
      this.leftDebouce = true;
    }
    return delta;
  }

  getCursor(){
    let clone = {
      x: this.cursor.x,
      y: this.cursor.y,
      click: this.cursor.click,
      target: this.cursor.target
    };
    this.cursor.click = false;
    return clone;
  }

  getStartButton(){
    return this.gamePad.buttons[this.start].pressed;
  }

  isStabbing(){
    return this.gamePad.buttons[this.attack].pressed;
  }

}

class UI{

  /**
  * creates a new UI object with the following object to controll.
  * @constructor
  * @param {Flucht} flucht the controlled
  */
  constructor(flucht){
    /**
    * the main menu
    */
    this.MAINMENU = "MainMenu";
    /**
    * the party selection screen
    */
    this.PARTYSELECTION = "Party Selection";
    /**
    * the party screen
    */
    this.PARTY = "Party";
    /**
    * the screen for the murderer editor placement
    */
    this.MURDER_EDITOR = "Murder Editor";
    /**
    * the screen that says you won
    */
    this.WON = "Won";
    /**
    * the screen that says you are WAITING
    */
    this.WAITING = "waiting";
    /**
    * help screen
    */
    this.HELP = "Help";
    /**
    * the finial screen
    */
    this.DONE = "done";
    /**
    * the about screen
    */
    this.ABOUT = "about";

    this.flucht = flucht;
    this.mainMenuDOM = document.getElementById("GameMenuWrapper");
    this.partySelectionDOM = document.getElementById("PartySelectionWrapper");
    this.partyDOM = document.getElementById("PartyWrapper");
    this.nameEntry = document.getElementById("NameInput");
    this.editor = document.getElementById("MurderEditor");
    this.won = document.getElementById("Won");
    this.help = document.getElementById("Help");
    this.messageOverlay = document.getElementById("MessageOverlay");
    this.waiting = document.getElementById("Waiting");
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.about = document.getElementById("About");
    this.screen = this.MAINMENU;

    this.nameEntry.value = this.flucht.name;

    this.inputMethod = new KMInputMethod();
    this.usingKeyboard = true;

    if(navigator.getGamepads()[0]){
      this.useGamePad(0, true);
    }

    this.nextDebounce = false;
    this.nextButton = document.getElementById("Start");

  }

  useKeyboard(){
    this.usingKeyboard = true;
    let listeners = this.inputMethod.listeners;
    this.inputMethod = new KMInputMethod();
    this.inputMethod.listeners = listeners;
    this.displayMessage("Gamepad Disconnected", 1000);
  }

  useGamePad(index, override){
    this.usingKeyboard = false;
    let listeners = this.inputMethod.listeners;
    this.inputMethod = new ControllerInputMethod(index);
    this.inputMethod.listeners = listeners;
    if(!override)
      this.displayMessage("Gamepad Connected", 1000);
  }

  displayMessage(message, timeout){
    let animationLength = 300;
    this.messageOverlay.innerHTML = message;
    this.messageOverlay.style.display = "block";
    this.messageOverlay.style["line-height"] = window.innerHeight + "px";
    this.messageOverlay.style.opacity = "0";
    let messageOverlay = this.messageOverlay;
    setTimeout(function(){
      messageOverlay.style.opacity = "1";
    }, 50);
    setTimeout(function(){
      messageOverlay.style.opacity = "0";
    }, timeout-animationLength);
    setTimeout(function(){
      messageOverlay.style.display="none";
    }, timeout);
  }

  /**
  * called when a UI event is fired
  * @param {String} key the key for the event
  */
  event(key){
    switch(key){
      case "Start":
        this.switchScreen(this.PARTY);
        this.flucht.setName(this.nameEntry.value);
        this.flucht.initalize();
        this.flucht.toggleReady();
        break;
      case "NewParty":
        this.switchScreen(this.PARTY);
        break;
      case "Ready":
        this.flucht.toggleReady();
        break;
      case "MurdererDone":
        this.flucht.startGame();
        break;
      case "Help":
        this.switchScreen(this.HELP);
        break;
      case "Back":
        this.switchScreen(this.MAINMENU);
        break;
      case "Reload":
        window.location.reload(false);
        break;
      case "About":
        this.switchScreen(this.ABOUT);
        break;
      default:
        console.log("Unhandled Key", key);
    }
  }

  switchScreen(screen){
    this.nextButton = false;
    if(this.screen === screen && (screen !== this.WAITING)){
      return;
    }
    if(this.screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "none";
    }
    if(screen === this.MAINMENU){
      this.mainMenuDOM.style.display = "flex";
      this.nextButton = document.getElementById("Start");
    }
    if(this.screen === this.PARTYSELECTION){
      this.partySelectionDOM.style.display = "none";
    }
    if(screen === this.PARTYSELECTION){
      this.partySelectionDOM.style.display = "flex";
    }
    if(this.screen === this.PARTY){
      this.partyDOM.style.display = "none";
    }
    if(screen === this.PARTY){
      this.partyDOM.style.display = "block";
      this.nextButton = document.getElementById("ReadyButton");
    }
    if(this.screen === this.MURDER_EDITOR){
      this.editor.style.display = "none";
    }
    if(screen === this.MURDER_EDITOR){
      this.editor.style.display = "block";
      this.nextButton = document.getElementById("MurdererDone");
      this.tryCanvas("block");
    }
    if(screen === this.GAME){
      this.partyDOM.style.display = "none";
      this.partySelectionDOM.style.display = "none";
      this.mainMenuDOM.style.display = "none";
      this.tryCanvas("block");
    }
    if(this.screen === this.WON){
      this.won.style.display = "none";
    }
    if(screen === this.WON){
      this.won.style.display = "block";
      this.won.style["line-height"] = window.innerHeight + "px";
      this.tryCanvas("none");
    }
    if(this.screen === this.HELP){
      this.help.style.display = "none";
    }
    if(screen === this.HELP){
      this.help.style.display = "block";
    }
    if(this.screen === this.WAITING){
      this.waiting.style.display = "none";
    }
    if(screen === this.WAITING){
      let string = "<div>Waiting for Murderer, Here are the scores so far</div><table class=\"scores\">";
      for(let id in flucht.scores){
        let name = "undef";
        let nameEnd = id.lastIndexOf("-");
        if(nameEnd){
          name = id.substring(0, nameEnd);
        }
        string += '<tr><td>' + name + '</td><td>' + flucht.scores[id] + '</td></tr>';
      }
      string += "</table>";
      this.waiting.innerHTML = string;
      this.waiting.style.display = "block";
      this.tryCanvas("none");
    }
    if(this.screen === this.DONE){
      this.waiting.style.display = "none";
    }
    if(screen === this.DONE){
      let string = "<div>You finished! Here are the scores!</div><table class=\"scores\">";
      for(let id in flucht.scores){
        let name = "undef";
        let nameEnd = id.lastIndexOf("-");
        if(nameEnd){
          name = id.substring(0, nameEnd);
        }
        string += '<tr><td>' + name + '</td><td>' + flucht.scores[id] + '</td></tr>';
      }
      string += "</table><div onclick=\"flucht.onUserEvent('Reload')\" class=\"MenuButton\">Again!</div>";
      this.waiting.innerHTML = string;
      this.waiting.style.display = "block";
    }
    if(this.screen === this.ABOUT){
      this.about.style.display = "none";
    }
    if(screen === this.ABOUT){
      this.about.style.display = "flex";
    }
    this.screen = screen;
  }

  tryCanvas(tag){
    if(!this.canvas){
      this.canvas = document.getElementsByTagName("canvas")[0];
    }
    if(this.canvas){
      this.canvas.style.display = tag;
    }
  }

  update(){
    if(this.usingKeyboard){
      if(navigator.getGamepads()[0]){
        this.useGamePad(0);
      }
    } else {
      if(!navigator.getGamepads()[0]){
        this.useKeyboard();
      }
    }
    this.inputMethod.poll();
    if(this.inputMethod.getStartButton() && this.nextButton && !this.nextDebounce){
      this.nextButton.onclick();
      this.nextDebounce = true;
    }
    if(!this.inputMethod.getStartButton()){
      this.nextDebounce = false;
    }
  }

}

/**
* An item that can be placed and shows up in the hot bar
*/
class PlaceableItem{

  /**
  * creates a new placeable item with the information used to place it
  * @constructor
  */
  constructor(trap, displayImage){
    this.trap = trap;
    this.displayImage = displayImage;
  }

  /**
  * returns whether a trap can be placed There
  */
  canPlace(world, pos, room){
    this.trap.pos = pos;
    if(room){
      let least = false;
      let viablePos = false;
      for(let element of room.elements){
        if(element.type !== "Element"){
          continue;
        }
        let viable = this.determinViable(pos, element, world);
        if(!least){
          least = viable.dist;
          viablePos = viable;
        }
        if(viable.dist < least){
          least = viable.dist;
          viablePos = viable;
        }
      }
      if(viablePos && least <= 50){
        this.trap.pos = {x: viablePos.x, y:viablePos.y};
        return this.trap.pos;
      }
    }
    return false;
  }

  /**
  * determins whether or not a placement is viable, as in whether it can be
  * corrected or not
  */
  determinViable(pos, element, world){
    if(element.box.width <= element.box.height*2){
      return false;
    }
    let left = element.pos.x - element.box.width/2 + this.trap.box.width/2;
    let right = element.pos.x + element.box.width/2 - this.trap.box.width/2;
    let height = element.pos.y;
    let bestX = pos.x;
    if(bestX < left){
      bestX = left;
    }
    if(bestX > right){
      bestX = right;
    }
    let bestY = height + element.box.height/2 + this.trap.box.height/2 + 0.01;
    let oldTrapPos = this.trap.pos;
    this.trap.pos = {x: bestX, y:bestY};
    let collision = world.doesTerrainCollide(this.trap);
    if(collision){
      return false;
    }
    this.trap.pos = oldTrapPos;
    let dist = Math.sqrt(Math.pow(pos.x - bestX, 2)
      + Math.pow(pos.y - bestY, 2));
    let data = {x: bestX, y: bestY, dist: dist};
    return data;
  }

  place(world, pos, id){
    this.trap.pos = pos;
    this.trap.pos.y -= this.trap.box.height/2;
    let w = this.trap.box.width;
    let h = this.trap.box.height;
    // this.trap.box.width = 1;
    // this.trap.box.height = 1;
    let clonedTrap = this.trap.clone();
    clonedTrap.id = id;
    world.addElement(clonedTrap);
    let json = JSON.stringify(clonedTrap);
    this.trap.box.width = w;
    this.trap.box.height = h;
    return json;

  }

  /**
  *  @return {String} the url to the image to be displayed for the hot bar
  */
  getDisplayImageURL(){
    return this.displayImage;
  }

}

class HotBar{

  /**
  * creates a new hot bar, always has 10 slots [0,9]
  * @constructor
  */
  constructor(){
    /**
    * the string for the event fired when a slot is changed
    */
    this.SLOT_CHANGED = "slotChanged";

    /**
    * the string for when an item in the specified slot is changed
    */
    this.ITEM_CHANGED = "Item Changed";

    this.items = [new PlaceableItem(new BearTrap(0,0,64,64, {
      "url":"/assets/Traps/BearTrap/BearTrap.json",
      "offsetX": 0,
      "offsetY": -32,
      "ghost": false
    }), "/assets/Traps/BearTrap/trap_Animation1_1.png")];
    this.currentSelected = 0;
    this.listeners = [];
  }

  /**
   *@param {number} slot the slot index
  * @return {Item} item the item in the slot
  */
  getItemInSlot(slot){
    return this.items[slot];
  }

  /**
   *@param {number} slot the slot index
  * @return {boolean} empty returns if the slot is currently empty
  */
  isSlotEmpty(slot){
    if(this.items[slot]){
      return false;
    } else {
      return true;
    }
  }

  /**
  * @return {number} selectedIndex returns the index of the slected slot
  */
  getSelectedSlot(){
    return this.currentSelected;
  }

  /**
  * adds a listener to the hot bar
  * @param {Object} listener the listener
  * @param {Function} listener.onEvent the method called when an event is fired
  */
  addChangeListener(listener){
    this.listeners.push(listener);
  }

  /**
  * private, called when the listeners should be notified
  * @param {String} event the event that has occured
  * @param {Object} data extra data if it is desired
  */
  notifyObservers(event, data){
    for(let listener of this.listeners){
      listener.onEvent(event, data);
    }
  }

  /**
  * sets the selected slot
  * @param {number} index the index of the slot [0,9]
  */
  setSelectedSlot(index){
    this.currentSelected = index;
    this.notifyObservers(this.SLOT_CHANGED, index);
  }

}

/**
* a class to manage the hot bar for there will be a lot of dom manipulation that is required
*/
class HotBarUI{

  /**
  * creates a new HotBarUI
  * @constructor
  * @param {HotBar} hotBar the hot bar object which the UI should represent
  */
  constructor(hotBar){
    this.hotBarTable = document.getElementById("HotBar");
    this.hotBarCells = [];
    for(let i = 0; i < 10; i++){
      this.hotBarCells[i] = document.getElementById("HotBar" + i);
    }
    this.visible = true;
    this.hotBar = hotBar;
    this.pos = -1;
    this.hotBar.addChangeListener(this);
    for(let i = 0; i<10; i++){
      if(!this.hotBar.isSlotEmpty(i)){
        this.onEvent(this.hotBar.ITEM_CHANGED, {index: i, item: this.hotBar.getItemInSlot(i)});
      }
    }
  }

  /**
  * called when an event from the hot bar happens
  * @param {String} event the hot bar event
  * @param {object} data data associated with the event
  */
  onEvent(event, data){
    if(event === this.hotBar.ITEM_CHANGED){
      let cell = this.hotBarCells[data.index];
      cell.style.backgroundImage = "url(" + data.item.getDisplayImageURL() + ")";
    }
    if(event === this.hotBar.SLOT_CHANGED){
      if(data !== this.pos){
        this.deselect(this.pos);
        this.pos = data;
        this.select(data);
      }
    }
  }

  /**
  * used to select cell
  * @param {number} cellIndex the index of the cell cell to select
  */
  select(cellIndex){
    if(cellIndex > 0 && cellIndex < 10){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "solid 2px red";
      prev.style["border-right"] = "solid 2px red";
    } else if(cellIndex === 0){
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "solid 2px red";
    }

  }

  /**
  * used to deselect cell
  * @param {number} cellIndex the index of the cell cell to select
  */
  deselect(cellIndex){
    if(cellIndex > 0 && cellIndex < 9){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      cell.style["border-right"] = "solid 2px #999999";
      prev.style["border-right"] = "solid 2px #999999";
    } else if(cellIndex === 0){
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      cell.style["border-right"] = "solid 2px #999999";
    } else if(cellIndex === 9){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      prev.style["border-right"] = "solid 2px #999999";
    }
  }

  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    let pos = inputMethod.getHotbarPosSet();
    if(pos !== false){
      this.hotBar.setSelectedSlot(pos);
    } else {
      let delta = inputMethod.getHotbarPosDelta();
      let oldPos = this.hotBar.getSelectedSlot();
      oldPos += delta;
      oldPos = oldPos % 10;
      if(oldPos < 0){
        oldPos = 9;
      }
      this.hotBar.setSelectedSlot(oldPos);
    }
  }

}

/**
* a class to represent the trap ghost
*/
class TrapGhost{

  constructor(){
    this.boudingBox = {w: 0, h:0};
    this.textureCache = {};
    this.sprite = new PIXI.Sprite();
    this.urlCache = {};
    this.element = false;
    this.width = 0;
    this.height = 0;
  }

  /**
  * loads a new texture into the TrapGhost
  */
  loadTexture(discription){
    let url = discription.base +
     discription.animations[discription.defaultId].range[0] +
     discription.animations[discription.defaultId].extention;
    if(this.textureCache[url]){
      this.sprite.texture = this.textureCache[url];
      this.sprite.scale.x = discription.scaleX;
      this.sprite.scale.y = discription.scaleY;
    } else {
      this.textureCache[url] = PIXI.Texture.fromImage(url, false, PIXI.SCALE_MODES.NEAREST);
      this.sprite.texture = this.textureCache[url];
      this.sprite.scale.x = discription.scaleX;
      this.sprite.scale.y = discription.scaleY;
    }
    this.width = discription.width*discription.scaleX;
    this.height = discription.height *discription.scaleY;
  }

  /**
  * sets the element to a new element
  * @param {Trap} element the element
  */
  setElement(element){
    if(this.element === element){
      return;
    }
    this.element = element;
    if(this.urlCache[element.url]){
      this.loadTexture(this.urlCache[element.url]);
    } else {
      let self = this;
      httpRequest$1(element.trap.url, function(response){
        self.urlCache[element.url] = response;
        self.loadTexture(response);
      });
    }
  }

  show(){
    this.sprite.visible = true;
  }

  hide(){
    this.sprite.visible = false;
  }

  setValidity(valid){
    if(valid){
      this.sprite.tint = 0x44FF44;
    } else {
      this.sprite.tint = 0xFF4444;
    }
  }

  setPos(x, y){
    this.sprite.x = x - this.width/2;
    this.sprite.y = y - this.height/2;
  }

}

/**
* makes an XMLHttpRequest with the given arguments at the url and calls the callback with the data
* @param {String} url the url to querry
* @param {Function} callback the callback function
* @param {Object} passArg the arguments to directly pass into the callback
*/
var httpRequest$1 = function httpRequest(url, callback, passArg){
  let theHttpRequest = new XMLHttpRequest();
  theHttpRequest.onreadystatechange = function(){
    if (theHttpRequest.readyState === XMLHttpRequest.DONE) {
      if (theHttpRequest.status === 200) {
        callback(JSON.parse(theHttpRequest.responseText), passArg);
      }
    }
  };
  theHttpRequest.open('GET', url);
  theHttpRequest.setRequestHeader('Content-Type', 'text/json');
  theHttpRequest.send();
};

class MurderEditor{

  constructor(flucht, hotBar, world){
    this.enabled = true;
    this.x = 0;
    this.y = 0;
    this.flucht = flucht;
    this.hotBar = hotBar;
    this.world = world;
    this.additions = [];
    this.trapGhost = new TrapGhost();
    this.id = 10;
    this.vx = 0;
    this.vy = 0;
    this.trapsLeft = 30;
  }

  /**
  * called when key is pressed
  * @param {number} key the ascii value of the key pressed
  * @param {boolean} pressed whether or not the key was pressed or released
  */
  onKey(key, pressed){
    if(!pressed){
      return;
    }
    if(key > 47 && key < 58){
      let slot = key - 48;
      if(slot === 0){
        slot = 10;
      }
      slot --;
      if(!this.hotBar.isSlotEmpty(slot)){
        this.trapGhost.show();
        this.trapGhost.setElement(this.hotBar.getItemInSlot(slot));
      } else {
        this.trapGhost.hide();
      }
    }
  }

  /**
  * called when the mouse moves
  */
  onMouseMove(cursor){
    let slot = this.hotBar.getSelectedSlot();
    if(!this.hotBar.isSlotEmpty(slot)){
      this.trapGhost.show();
      this.element = this.hotBar.getItemInSlot(slot);
      this.trapGhost.setElement(this.element);
      this.trapGhost.setPos(cursor.x, cursor.y);
      let pos = {
        x: this.x + (cursor.x-window.innerWidth/2),
        y: this.y - (cursor.y-window.innerHeight/2)
      };
      let resultOfCanplace = this.element.canPlace(this.world, pos, this.getRoom(pos));
      if(resultOfCanplace){
        let reverseX = resultOfCanplace.x - this.x + window.innerWidth/2;
        let reverseY = -resultOfCanplace.y + this.y + window.innerHeight/2;
        this.trapGhost.setPos(reverseX, reverseY);
        this.trapGhost.setValidity(true);
      } else {
        this.trapGhost.setValidity(false);
      }
    } else {
      this.trapGhost.hide();
    }
  }

  /**
  * called when the mouse moves
  */
  onClick(cursor){
    if(this.trapsLeft < 1){
      return;
    }
    if(cursor.target !== "MurderEditor"){
      return;
    }
    let slot = this.hotBar.getSelectedSlot();
    if(!this.hotBar.isSlotEmpty(slot)){
      this.trapGhost.show();
      this.element = this.hotBar.getItemInSlot(slot);
      this.trapGhost.setElement(this.element);
      this.trapGhost.setPos(cursor.x, cursor.y);
      let pos = {
        x: this.x + (cursor.x-window.innerWidth/2),
        y: this.y - (cursor.y-window.innerHeight/2)
      };
      let resultOfCanplace = this.element.canPlace(this.world, pos, this.getRoom(pos));
      if(resultOfCanplace){
        pos = resultOfCanplace;
        let json = this.element.place(this.world, pos, this.id++);
        this.additions.push(json);
        this.trapsLeft --;
      }
    } else {
      this.trapGhost.hide();
    }
  }

  /**
  * returns the room corrisponding to the position provided
  */
  getRoom(pos){
    if(!this.world.terrain.rooms){
      return false;
    }
    for(let room of this.world.terrain.rooms){
      let soFar = pos.x > (room.x-room.box.width/2);
      soFar = soFar && pos.x < (room.x + room.box.width/2);
      soFar = soFar && pos.y > (room.y - room.box.height/2);
      soFar = soFar && pos.y < (room.y + room.box.height/2);
      if(soFar){
        return room;
      }
    }
    return false;
  }

  /**
  * called once every 20ms
  */
  update(){
    if(this.enabled){
      this.y += this.vy;
      this.x += this.vx;
      this.viewChanged({x: this.x, y:this.y});
    }
  }

  /**
  * called when an event is to be dispatched
  * @param {Object} data the data to use
  */
  viewChanged(data){
    this.flucht.murderEditorChanged(data);
  }

  /**
  * called to disabled the editor
  */
  disable(){
    this.enabled = false;
    this.viewChanged({enableChanged: true});
    this.trapGhost.hide();
  }

  /**
  * called to enabled the editor
  */
  enable(){
    this.trapsLeft = 30;
    this.enabled = true;
    this.viewChanged({enableChanged: true});
    this.x = 0;
    this.y = 0;
    this.viewChanged({x: this.x, y:this.y});
  }

  /**
  * @return {Array<JSONObject>} an array of json object which represent the new traps
  */
  getAdditions(){
    return this.additions;
  }

  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    if(!this.enabled){
      return;
    }
    this.vx = 20*inputMethod.getXMovement();
    this.vy = 20*inputMethod.getYMovement();
    this.cursor = inputMethod.getCursor();
    if(this.cursor.click){
      this.onClick(this.cursor);
    } else {
      this.onMouseMove(this.cursor);
    }
  }

}

let trapMap = {
  "Bear Trap" : BearTrap
};

class Murderer extends Runner{

  /**
  * creates a new runner with width and height at x and y
  * @constructor
  * @param {number} width the width of the runner
  * @param {number} height the height of the runner
  * @param {number} x the x pos of the runner
  * @param {number} y the y pos of the runner
  */
  constructor(world, width, height, x=0, y=0, name){
    super(width, height, x, y, name);
    this.murderer = true;
    this.tryingToStab = false;
    this.world = world;
    this.stabCooldown = 0;
    this.speed = (flucht.numerOfPlayers-1)*25 + 400;
  }

  /**
  * moves the entity with the given timestep
  * @param timestep the part of one second passed
  */
  update(timestep){
    super.update(timestep);
    if(this.tryingToStab && this.stabCooldown <= 0){
      let box = new Box(1,10);
      let x = this.pos.x;
      if(this.vel < 0){
        x -= 10;
      }
      this.world.dealDamage(box, 5, this, x, this.pos.y);
      this.stabCooldown = 15;
    }
    this.stabCooldown --;
  }

  /**
  * used to recive user input for the runner
  */
  tick(){
    super.tick();
  }


  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    super.onInput(inputMethod);
    if(this.deleted){
      return;
    }
    this.tryingToStab = inputMethod.isStabbing();
  }
}

/** class creates world, runner and renderer to begin the game*/
class Flucht{
  /**
  * creates the world, renderer and player  assigns event listeners to world class
  * @constructor
  */
  constructor(){
    if(localStorage.name){
      this.name = localStorage.name;
    } else {
      this.name = "Saya";
    }
    this.ui = new UI(this);
    this.murderList = [];
    this.scores = false;
    this.numerOfPlayers = 2;
  }

  /**
   * sets the name
   * @param {String} name the new name
   */
  setName(name){
    if(name){
      localStorage.name = name;
      this.name = name;
    }
  }

  /**
   * initilizes the flucht game
   */
  initalize(){
    this.seed = "Saya-" + Date.now();
    this.listeners = [];
    /**
    * the constant for the world created event
    */
    this.WORLDCREATED = "world created";

    this.ready = false;

    this.hotBar = new HotBar();
    this.hotBarUI = new HotBarUI(this.hotBar);
    this.hotBar.setSelectedSlot(0);
    this.ui.inputMethod.addInputListener(this.hotBarUI);

    this.ingame = false;

  }

  /**
  * adds a listener to flucht
  */
  addEventListener(listener){
    this.listeners.push(listener);
  }

  /**
  * toggles the ready state of the application
  */
  toggleReady(){
    this.ready = !this.ready;
    this.allReady();
  }

  /**
  * creates a new world based on the seed provided to flucht
  */
  createWorld(){
    if(this.world){
      return;
    }
    let self = this;
    this.world = new World({spawnRunner:function(data){
      let spawn = data.spawns[~~(Math.random()*data.spawns.length)];
      if(self.runner){
        self.runner.pos = spawn;
      } else {
        self.spawn = spawn;
      }
      self.renderer.onEvent("Terrain Updated", self.world.terrain);
      self.renderer.onEvent("Level Loaded", data.background);
      if(self.world.entities.length < 1 && self.runner){
        self.world.addEntity(self.runner, false);
      }
    }}, this.seed);
    this.renderer = new Renderer();
    this.world.addEventListener(this.renderer);
    for(listener in this.listeners){
      listener.onEvent(this.WORLDCREATED, this.world);
    }

    this.murderEditor = new MurderEditor(this, this.hotBar, this.world);
    this.murderEditor.disable();
    this.ui.inputMethod.addInputListener(this.murderEditor);
    this.renderer.addPlacementSprite(this.murderEditor.trapGhost.sprite);
    this.renderer.disableLighting();
  }

  /**
  * inserts the runner to the world
  */
  insertRunner(murderer){
    if(this.runner){
      return;
    }
      if(this.spawn){
        this.runner = new Murderer(this.world, 64, 108, this.spawn.x, this.spawn.y, this.name);
      } else {
        this.runner = new Murderer(this.world, 64, 108, 0, 76, this.name);
      }
      if(this.numerOfPlayers === 2){
        if(this.spawn){
          this.runner2 = new Runner(64, 108, this.spawn.x, this.spawn.y, this.name, true);
        } else {
          this.runner2 = new Runner(64, 108, 0, 76, this.name, true);
        }
      }
      if(this.numerOfPlayers === 1){
        this.renderer.addRunner(this.runner);
      }
    this.renderer.setNoMovement(this.numerOfPlayers === 2);
    this.world.addEntity(this.runner);
    if(this.numerOfPlayers === 2){
      this.world.addEntity(this.runner2);
    }
    this.ui.inputMethod.addInputListener(this.runner);
    if(this.numerOfPlayers === 2){
      this.ui.inputMethod.addInputListener(this.runner2);
    }
  }

  /**
  * called when packet is recived
  * @param {Packet} packet the packet recived
  */
  onPacket(packet){
    if(packet.id === PacketTypes.seed){
      this.seed = packet.data.seed;
      if(this.world){
        this.world.reset(this.seed);
      }
      if(this.runner){
        this.runner.pos.x = 0;
        this.runner.pos.y = 76;
      }
    } else if(packet.id === PacketTypes.host){
      this.host = packet.data.host;
    } else if(packet.id === PacketTypes.start){
      this.start(packet.data.murderer);
    } else if(packet.id === PacketTypes.trapPlacement){
      this.updateTraps(packet.data);
      this.startGame();
    } else if(packet.id === PacketTypes.roundEnd){
      this.murderList = packet.data.murderList;
      this.scores = packet.data.scores;
      this.ingame = false;
      this.seed = packet.data.nextSeed;
      if(packet.data.nextMurderer){
        this.restart(packet.data.nextMurderer);
      } else {
        window.done = true;
        this.ui.switchScreen(this.ui.DONE);
        this.networkConnection.unlockMe();
      }
    }
  }

  /**
  * called when a UI button is clicked
  */
  onUserEvent(event){
    this.ui.event(event);
  }

  /**
  * renderers all the elements in the stage
  */
  render(){
    if(this.renderer){
      this.renderer.render();
    }
  }

  /**
  * updates the world after 20 milliseconds
  */
  update(){
    this.ui.update();
    if(this.murderEditor){
      this.murderEditor.update();
    }
    if(this.world){
      this.world.tick(20/1000);
      if(this.elementNetworkSyncController){
        this.elementNetworkSyncController.update();
      }
    }
    if(this.runner && this.runner.dead && this.runner.murderer){
      this.allDone();
    }
    if(this.runner && this.runner.won && !this.runner.ghost){
      this.ui.displayMessage("You Won!!!!", 2000);
    }
    if(this.runner && this.runner.dead && !this.runner.ghost){
      this.ui.displayMessage("You Died. :(", 200);
    }
  }

  /**
  * called when all of the users are ready by PartyWorld
  */
  allReady(){
    if(this.ingame){
      return;
    }
    this.start();
  }

  /**
  * starts the game, the murerder id is for the UI and to get the right state
  */
  start(){
    this.ingame = true;
    if(!this.world){
      this.createWorld();
    } else {
      this.world.reset(this.seed);
      this.renderer.disableLighting();
    }
      this.ui.switchScreen(this.ui.MURDER_EDITOR);
      this.murderEditor.enable();
      this.ui.displayMessage("Starting Demo. Place your traps.", 2000);
  }

  /**
  * called when the murderer editor has changed
  * @param {Object} data the data
  */
  murderEditorChanged(data){
    if(data.enableChanged && this.renderer){
      if(this.murderEditor.enabled){
        this.renderer.disableLighting();
      } else {
        this.renderer.enableLighting();
      }
      return;
    }
    if(this.renderer){
      this.renderer.setPos(data.x, data.y);
    }
  }

  /**
  * called as a response to sendOutChanges and updates the world with the new traps
  */
  updateTraps(traps){
    for(let trapJSON of traps){
      let trapJSONObject = JSON.parse(trapJSON);
      let constructor = trapMap[trapJSONObject.type];
      let trap = new constructor();
      trap.fromJSON(trapJSONObject);
      this.world.addElement(trap);
    }
  }

  /**
  * starts the game with the current traps
  */
  startGame(){
    this.ui.switchScreen(this.ui.GAME);
    this.murderEditor.disable();
    this.ui.displayMessage("Have fun in the Demo! Use WASD & Arrow Keys to Move", 4000);
    this.insertRunner(true);
  }

  /**
  * called when all other players are dead or have won
  */
  allDone(){
    if(!this.runner.murderer){
      return;
    }
    let winners = [];
    let numberDead = 0;
    let players = [];
    for(let player of winners){
      this.scores[player] += pot/winners.length;
    }
    if(this.runner.dead){
      for(let player of players){
        this.scores[player] += 100;
      }
    }
    this.scores[this.networkConnection.id] += numberDead*100;
    let nextMurderer = false;
    while(players.length > 0){
      let index = ~~(Math.random()*players.length);
      if(this.murderList.indexOf(players[index]) === -1){
        nextMurderer = players[index];
        break;
      }
      players.splice(index, 1);
    }
    let data = {
      murderList : this.murderList,
      scores : this.scores,
      nextMurderer: nextMurderer,
      nextSeed : Math.random() + "-new"
    };
    this.seed = data.nextSeed;
    let packet = new Packet(false, false, PacketTypes.roundEnd, data);
    this.pm.broadcast(packet);
    this.ingame = false;
    this.restart(data.nextMurderer);
  }

  /**
  * starts the next round of the game
  */
  restart(nextMurderer){
    if(nextMurderer === false){
      this.ui.switchScreen(this.ui.DONE);
      this.networkConnection.unlockMe();
      window.done = true;
      return;
    }
    console.log("Murderer is", nextMurderer, "I am", this.networkConnection.id);
    this.runner.deleted = true;
    this.runner = false;
    if(this.ingame){
      return;
    }
    if(this.networkConnection.id === nextMurderer){
      this.pm.broadcast(new Packet(false, false, PacketTypes.start, {start:true, murderer:this.networkConnection.id}));
      this.start(this.networkConnection.id);
      this.murderList.push(this.networkConnection.id);
    }
  }
}

var done = false;

/** Creates a new network Connection and runs the game*/
setTimeout(function(){
  var flucht = new Flucht();
  window.flucht = flucht;
  var animate = function animate(){
    if(done){
      return;
    }
    requestAnimationFrame(animate);
    flucht.render();
  };
  requestAnimationFrame(animate);
  var updateFlucht = function update(){
    if(done){
      return;
    }
    setTimeout(updateFlucht, 20);
    flucht.update();
  };
  setTimeout(updateFlucht, 20);
document.body.style.height = window.innerHeight + "px";
  document.addEventListener("DOMContentLoaded", function(event) {
    document.body.style.height = window.innerHeight + "px";
    flucht.renderer.resize();
    animate();
  });

}, 10);
