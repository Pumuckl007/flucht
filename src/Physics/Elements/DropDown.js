import Element from "./Element.js";
/**class that creates "Drop Down" type element*/
class DropDown extends Element{
  /**
  * creates DropDown object by calling Element Constructor with type "Drop Down"
  * @constructor
  * @param {number} x the x-coordinate of Drop Down element
  * @param {number} y the y-coordinate of Drop Down element
  * @param {number} width width of the element
  * @param {number} height height of the element
  */
  constructor(x, y, width, height){
    super(x, y, width, height, "Drop Down");
  }

  /**
  * checks if there is a collision on specific side of the element
  * @param {Entity} entity the entity that collides with this
  * @param {number} side the side where collision occurs
  * @param {number} entityX the x-coordinate of the entity
  * @param {number} entityY the y-coordinate of the entity
  * @returns {boolean} returns true if collision occurs on any side other than 2
  */
  collision(entity, side, entityX, entityY){
    if(side === 2){
      let relFeetHeight = entityY - entity.box.height/2 - this.pos.y;
      if( relFeetHeight > -this.box.height && relFeetHeight < this.box.height/2){
        return false;
      }
    }
    return true;
  }
}

export default DropDown;
