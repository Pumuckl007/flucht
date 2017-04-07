import Element from "./Element.js";
/** Creates an element that is type "TexturedElement" */
class TexturedElement extends Element{
  constructor(x, y, width, height, element){
    super(x, y, width, height, "Textured Element", false);
    this.state = "idle";
    this.url = element.url;
    this.offY = element.offsetY;
    this.offX = element.offsetX;
    this.ghost = element.ghost;
  }

  collision(entity, side, entityX, entityY){

  }
}

export default TexturedElement;
