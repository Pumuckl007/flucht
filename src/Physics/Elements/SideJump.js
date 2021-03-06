import TexturedElement from "./TexturedElement.js";
/** creates element of type "Side Jump" that can be moved through from the side*/
class SideJump extends TexturedElement{
  /**
  * creates a Side Jump element using Element constructor and assigns type "SideJump"
  * @constructor
  * @param {number} x the x-coordinate of Side jump element
  * @param {number} y the y-coordinate of Side Jump element
  * @param {number} width width of the element
  * @param {number} height height of the element
  */
  constructor(x, y, width, height, noLongerVisible = false){
    super(x, y, width, height, {
      "x": x,
      "y": y,
      "width": width,
      "height": height,
      "type": "Textured Element",
      "url": "/assets/Stairs/Stairs.json",
      "offsetX": -32,
      "offsetY": -34
    });
    this.type = "Side Jump";
    this.needsUpdate = true;
    this.noLongerVisible = noLongerVisible;
    this.color = this.noLongerVisible ? 0xFFFFFF : 0;
  }
/**
* checks if there is a collision on side 3
* @param {Entity} entity the entity that is collided with
* @param {number} side the side where collision occurs
*/
  collision(entity, side){
    if(side === 3){
      let relFeetHeight = entity.pos.y - entity.box.height/2 - this.pos.y;
      if( relFeetHeight > -this.box.height/2-10 && relFeetHeight < this.box.height/2+10){
        entity.pos.y = this.pos.y+this.box.height/2+entity.box.height/2;
        entity.vel.y = Math.max(entity.vel.y, 0);
      }
    }
  }
}

export default SideJump;
