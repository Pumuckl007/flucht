import Box from "./../Box.js";
/**class representing physical element in space*/
class Element{
  constructor(x, y, width, height, type = "Element", renderAsBox = true){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height);
    this.type = type;
    this.renderAsBox = renderAsBox;
  }
  /**
  * empty method called when collision occurs and returns which side collided
  * @param entity object that collides with this
  * @param side side where the collision occurs
  */
  collision(entity, side){

  }
  /** empty method called when updating*/
  update(){

  }
}

export default Element;
