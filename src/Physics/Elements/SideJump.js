import Element from "./Element.js";

class SideJump extends Element{
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
