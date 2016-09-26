import Box from "./Box.js";

class Entity{

  constructor(width = 1, height = 1){
    this.state = "idle";
    this.pos = {x:0, y:0}
    this.box = new Box(width, height);
    this.needsTick = false;
    this.hasPhysics = false;
    this.vel = {x:0, y:0};
    this.type = "Entity";
  }

}

export default Entity;
