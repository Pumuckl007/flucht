import Box from "./../Box.js";

class Element{
  constructor(x, y, width, height, type = "Element", renderAsBox = true){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height);
    this.type = type;
    this.renderAsBox = renderAsBox;
  }

  collision(entity, side){

  }

  update(){
    
  }
}

export default Element;
