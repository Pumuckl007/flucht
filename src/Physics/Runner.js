import Entity from "./Entity.js";

class Runner extends Entity{
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
  * @peram timestep the part of one second passed
  */
  update(timestep){
    this.pos.x += this.vel.x*timestep;
    this.pos.y += this.vel.y*timestep;
    this.vel.y -= 20;
  }

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
  }

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
