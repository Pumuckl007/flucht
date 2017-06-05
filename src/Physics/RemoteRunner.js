import Entity from "./Entity.js";

/**
* A class representitive of the runner which the player controls
*/
class RemoteRunner extends Entity{

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
    this.worldCollisions = true;
    this.type = "Remote Runner";
    this.onGround = true;
    this.crouching = false;
    this.pos = {x:x, y:y};
    this.health = 100;
    this.healthDelta = 0;
    this.name = name;
    this.frozen = false;
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
      return (type === 4 || type === 1) || this.crouching;
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
  remoteUpdate(pos, vel, crouching, state, health, frozen){
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.vel.x = vel.x;
    this.vel.y = vel.y;
    this.state = state;
    this.crouching = crouching;
    this.health = health;
    this.frozen = frozen;
  }

  /**
  * hurts the remote runner
  * @param {Number} amount the amount to hurt
  */
  hurt(amount){
    this.healthDelta += amount;
  }
}

export default RemoteRunner;
