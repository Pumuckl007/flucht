import Box from "./Box.js";

class Terrain{
  constructor(){
    this.elements = [new Element(0, -10, 8000, 20)];
  }
}

class Element{
  constructor(x, y, width, height){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height);
  }

  collision(entity, side){

  }
}

export default Terrain;
