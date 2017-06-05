import Entity from "./Entity.js";
import InputMethodEvents from "./../InputMethodEvents.js";

/**
* A class representitive of the runner which the player controls
*/
class Runner extends Entity{

  /**
  * creates a new runner with width and height at x and y
  * @constructor
  * @param {number} width the width of the runner
  * @param {number} height the height of the runner
  * @param {number} x the x pos of the runner
  * @param {number} y the y pos of the runner
  */
  constructor(width, height, x=0, y=0, name = "saya"){
    super(width, height);
    this.hasPhysics = true;
    this.needsTick = true;
    this.worldCollisions = true;
    this.type = "Runner";
    this.onGround = true;;
    this.pos = {x:x, y:y};
    this.frozen = false;
    this.health = 100;
    this.crouching = false;
    this.jumping = false;
    this.dead = false;
    this.name = name;
  }

  /**
  * moves the entity with the given timestep
  * @param timestep the part of one second passed
  */
  update(timestep){
    if(!this.frozen){
      this.pos.x += this.vel.x*timestep;
      this.pos.y += this.vel.y*timestep;
      this.vel.y -= 20;
    }
    //console.log(this.vel.x);
  }

  /**
  * used to recive user input for the runner
  */
  tick(){
    if(Math.abs(this.vel.x) > 0){
      this.state = "running";
    } else {
      this.state = "idle";
    }
    if(this.jumping){
      if(this.onGround){
        this.onGround = false;
        this.vel.y = 500;
      }
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
      this.health = 0;
    }
  }

  /**
  * called upon a collision with a terrain element, type is the type of collision.
  * @param {TerrainElement} terrainElement the terrain element collided with
  * @param {number} type the side of which the collision occured on
  */
  collision(terrainElement, type){
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
    this.vel.x = 300*inputMethod.getXMovement();
    this.jumping = inputMethod.jumpPushed();
    this.crouching = inputMethod.crouchHeld();
  }
}

export default Runner;
