import Element from "./Element.js";
/**class that creates "Drop Down" type element*/
class DropDown extends Element{
  constructor(x, y, width, height){
    super(x, y, width, height, "Drop Down");
  }
  
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
