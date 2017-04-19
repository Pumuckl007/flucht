import Box from "./../Box.js";
/**class representing physical element in space*/
class Element{
  /**
  * creates an element
  * @constructor
  * @param {number} x the x-coordinates of the element
  * @param {number} y the y-coordinate of the element
  * @param {number} width the width of the element
  * @param {number} height the height of the element
  * @param {String} type element type that is set to "Element"
  * @param {boolean} renderAsBox specifies if the element is a box or not
  */
  constructor(x, y, width, height, type = "Element", renderAsBox = true){
    this.pos = {x:x, y:y};
    this.box = new Box(width, height); //collision hit box
    this.type = type;
    this.renderAsBox = renderAsBox; //draws this as black square
    this.color = 0x000000; // color of square
  }
  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){

  }
  /** empty method called when updating*/
  update(){

  }
}

export default Element;
