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
    this.worldCollisions = true;
    this.type = "Remote Runner";
    this.onGround = true;
    this.crouching = false;
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
      return this.crouching;
    }
  }

  /**
  * called to update information about the entity from the other client.
  * @param {Position} pos the Position of the Runner
  * @param {Velocity} vel the velocity of the Runner
  * @param {boolean} crouching whether or not the runner is crouching
  */
  remoteUpdate(pos, vel, crouching){
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.vel.x = vel.x;
    this.vel.y = vel.y;
    this.crouching = crouching;
  }
}

export default Runner;
