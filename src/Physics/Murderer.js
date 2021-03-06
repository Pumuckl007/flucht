import Runner from "./Runner.js";
import Box from "./Box.js";

/**
* A class representitive of the murderer which the player controls
*/
class Murderer extends Runner{

  /**
  * creates a new runner with width and height at x and y
  * @constructor
  * @param {number} width the width of the runner
  * @param {number} height the height of the runner
  * @param {number} x the x pos of the runner
  * @param {number} y the y pos of the runner
  */
  constructor(world, width, height, x=0, y=0, name){
    super(width, height, x, y, name);
    this.murderer = true;
    this.tryingToStab = false;
    this.world = world;
    this.stabCooldown = 0;
    this.speed = (flucht.numerOfPlayers-1)*25 + 400;
  }

  /**
  * moves the entity with the given timestep
  * @param timestep the part of one second passed
  */
  update(timestep){
    super.update(timestep);
    if(this.tryingToStab && this.stabCooldown <= 0){
      let box = new Box(1,10)
      let x = this.pos.x;
      if(this.vel < 0){
        x -= 10;
      }
      this.world.dealDamage(box, 5, this, x, this.pos.y);
      this.stabCooldown = 15;
    }
    this.stabCooldown --;
  }

  /**
  * used to recive user input for the runner
  */
  tick(){
    super.tick();
  }


  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    super.onInput(inputMethod);
    if(this.deleted){
      return;
    }
    this.tryingToStab = inputMethod.isStabbing();
  }
}

export default Murderer;
