import Element from "./Element.js";

/**
* a class which represents the exit for the runners. Getting
* here leads to a win
*/
class Exit extends Element{

  /**
  * creates a new exit at the given x and y positions
  */
  constructor(x, y){
    super(x, y, 100, 200, "Exit");
    this.color = 0x0000FF;
  }

  /**
  * empty method called when collision occurs and returns which side collided
  * @param {Entity} entity object that collides with this
  * @param {number} side side where the collision occurs
  */
  collision(entity, side){
    if(entity.type === "Runner" && !entity.murderer && !entity.ghost && flucht.world.keyCollected){
      entity.won = true;
    }
    return true;
  }

}

export default Exit;
