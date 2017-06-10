import Element from "./Element.js";

/**
* a class which represents the exit for the runners. Getting
* here leads to a win
*/
class Key extends Element{

  /**
  * creates a new exit at the given x and y positions
  */
  constructor(x, y){
    super(x, y, 32, 32, "Key");
    this.color = 0xFFFF00;
    this.noLongerVisible = false;
    this.needsUpdate = true;
    this.hiddenOnMiniMap = true;
  }

  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){
    if(!entity.murderer && !entity.ghost){
      flucht.world.keyCollected = true;
      this.noLongerVisible = true;
    }
    return true;
  }

}

export default Key;
