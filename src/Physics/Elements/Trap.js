import Element from "./Element.js";

/** Creates element that is type "Trap" that collides and effects the player*/
class Trap extends Element{
  /**
  * Creates Trap that is rendered as a white square and can collide with runner
  * @constructor
  * @param {number} x the x-coordinates of the Trap Element
  * @param {number} y the y-coordinate of the Trap Element
  * @param {number} width the width of the Trap Element
  * @param {number} height the height of the Trap Element
  * @param {ElementDescription} element the description of the element that the image is displayed on
  */
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Trap");
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
    this.color = 0xffffff;
  }

  /**
  * Empty method that is called to check if collision occurs
  * @param {Entity} entity the entity that this collides with
  * @param {number} side the side where collision occurs
  * @param {number} entityX the x-coordinate of the entity that is collided with
  * @param {number} entityY the y-coordinate of the entity that is collided with
  */
    collision(entity, side, entityX, entityY){
      if(entity.type === "Runner"){
        entity.trapped(this);
      }
      if(entity.tapCount >= 5){
        this.ghost = true;
      }
    }
}

export default Trap;
