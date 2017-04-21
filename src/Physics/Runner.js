import Entity from "./Entity.js";

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
  constructor(width, height, x=0, y=0){
    super(width, height);
    this.hasPhysics = true;
    this.needsTick = true;
    this.worldCollisions = true;
    this.type = "Runner";
    this.onGround = true;
    this.pos = {x:x, y:y};


  }

  /**
  * moves the entity with the given timestep
  * @param timestep the part of one second passed
  */
  update(timestep){
    this.pos.x += this.vel.x*timestep;
    this.pos.y += this.vel.y*timestep;
    this.vel.y -= 20;
  }

  /**
  * used to recive user input for the runner
  */
  tick(){
    if(keys[68]){
      this.vel.x = 300;
      this.state = "running";
    } else if(keys[65]){
      this.vel.x = -300;
      this.state = "running";
    } else {
      this.vel.x = 0;
      this.state = "idle";
    }
    if(keys[32]){
      if(this.onGround){
        this.onGround = false;
        this.vel.y = 500;
      }
    }
    if(!this.hasPhysics){
      this.escape();
      //console.log("escape");
    }

  }

  trapped(trap){
    this.tapCount = 0;
    this.hasPhysics = false;
    this.trap = trap;
  }

  escape(){
    if(keys[68] && this.lastKey != 0){
      this.lastKey = 0;
      this.tapCount += 1;
    }
    else if(keys[65] && this.lastKey != 1){
      this.lastKey = 1;
      this.tapCount += 1;
    }
    if(this.tapCount === 20){
      this.trap.ghost = true;
      this.hasPhysics = true;
      this.tapCount = 0;
      this.trap.color = 0x00FF22;
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
      return (type === 4 || type === 1) || keys[83];
    } else if(terrainElement.type === "Drop Down"){
      return keys[83];
    }
  }
}

export default Runner;
