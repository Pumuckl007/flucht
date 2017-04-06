import Element from "./Element.js";
/** creates element type "SideJump"*/
class SideJump extends Element{
  /**
  * creates a Side Jump element using Element constructor and assigns type "SideJump"
  * @constructor
  * @param {number} x the x-coordinate of Side jump element
  * @param {number} y the y-coordinate of Side Jump element
  * @param {number} width width of the element
  * @param {number} height height of the element
  */
  constructor(x, y, width, height){
    super(x, y, width, height, "Side Jump");
  }

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
