import Box from "./Box.js";

class Terrain{
  constructor(){
    this.elements = [new Element(0, -10, 8000, 20), new Element(300, 30, 200, 100)];
    this.elements.push(new Element(-200, 120, 100, 10));
    this.elements.push(new Element(80, 210, 80, 70))
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
