import Element from "./Element.js";
/** Creates an element that is type "TexturedElement" that exists to display an image*/
class TexturedElement extends Element{
  /**
  * Creates Textured Element using element constructor and setting type to "Textured Element"
  * @constructor
  * @param {number} x the x-coordinates of the Textured Element
  * @param {number} y the y-coordinate of the Textured Element
  * @param {number} width the width of the Textured Element
  * @param {number} height the height of the Textured Element
  * @param {ElementDescription} element the description of the element that the image is displayed on
  */
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Textured Element", false);
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
  }
/**
* Empty method that is called to check if collision occurs
* @param {Entity} entity the entity that this collides with
* @param {number} side the side where collision occurs
* @param {number} entityX the x-coordinate of the entity that is collided with
* @param {number} entityY the y-coordinate of the entity that is collided with
*/
  collision(entity, side, entityX, entityY){

  }
}

export default TexturedElement;
