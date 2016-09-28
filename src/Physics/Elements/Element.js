import Box from "./../Box.js";

class Element{
  constructor(x, y, width, height, type = "Element"){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height);
    this.type = type;
  }

  collision(entity, side){

  }
}

export default Element;
