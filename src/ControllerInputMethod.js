
/**
* a class used to get all the input values from a controller
*/
class ControllerInputMethod{

  constructor(id){
    this.id = id;
    this.gamePad = navigator.getGamepads()[id];
    this.listeners = [];

    this.leftDebouce = true;
    this.rightDebouce = true;

    this.cursor = {
      x : window.innerWidth/2,
      y : window.innerHeight/2,
      clicked : false,
      unClicked : true,
      target: ""
    }
    this.jump = 0;
    this.crouch = 10;
    this.click = 11;
    this.attack = 2;
    this.start = 9;
    this.hotBarPlus = 5;
    this.hotBarMinus = 4;
  }

  /**
  * call to add an input listener
  * @param {Object} listener the listener Object
  * @param {Function} listener.onInput this function is called when the input updates
  */
  addInputListener(listener){
    this.listeners.push(listener);
  }

  /**
  * called when clicked
  */
  onClick(e){
    this.cursor.click = true;
    this.cursor.target = e.target.id;
  }

  /**
  * called when mouse moves
  */
  onMouseMove(e){
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  }

  /**
  * polls the inputs and emits any events
  */
  poll(){
    this.gamePad = navigator.getGamepads()[this.id];
    let xAxis = this.gamePad.axes[2];
    if(Math.abs(xAxis) < 0.2){
      xAxis = 0;
    }
    let yAxis = this.gamePad.axes[3];
    if(Math.abs(yAxis) < 0.2){
      yAxis = 0;
    }
    if(xAxis !== 0){
      this.cursor.x += 10*Math.abs(xAxis)/xAxis*Math.pow(xAxis, 2);
    }
    if(yAxis !== 0){
      this.cursor.y += 10*Math.abs(yAxis)/yAxis*Math.pow(yAxis, 2);
    }
    if(this.cursor.x < 0){
      this.cursor.x = 0;
    }
    if(this.cursor.y < 0){
      this.cursor.y = 0;
    }
    if(this.cursor.x > window.innerWidth){
      this.cursor.x = window.innerWidth;
    }
    if(this.cursor.y > window.innerHeight){
      this.cursor.y = window.innerHeight;
    }
    if(this.cursor.unclicked && this.gamePad.buttons[this.click].pressed){
      this.cursor.click = true;
      this.cursor.unclicked = false;
    }
    if(!this.gamePad.buttons[this.click].pressed && !this.cursor.unclicked){
      this.cursor.unclicked = true;
      this.cursor.click = false;
    }
    this.cursor.target = "MurderEditor"
    for(let listener of this.listeners){
      listener.onInput(this);
    }
  }

  getXMovement(){
    let xAxis = this.gamePad.axes[0];
    if(Math.abs(xAxis) > 0.2){
      return xAxis;
    }
    return 0;
  }

  getYMovement(){
    let yAxis = -this.gamePad.axes[1];
    if(Math.abs(yAxis) > 0.2){
      return yAxis;
    }
    return 0;
  }

  jumpPushed(){
    return this.gamePad.buttons[this.jump].pressed;
  }

  crouchHeld(){
    return this.gamePad.buttons[this.crouch].pressed;
  }

  getHotbarPosSet(){
    return false;
  }

  getHotbarPosDelta(){
    let delta = 0;
    if(this.gamePad.buttons[this.hotBarPlus].pressed && this.rightDebouce){
      this.rightDebouce = false;
      delta += 1;
    }
    if(!this.gamePad.buttons[this.hotBarPlus].pressed){
      this.rightDebouce = true;
    }
    if(this.gamePad.buttons[this.hotBarMinus].pressed && this.leftDebouce){
      this.leftDebouce = false;
      delta -= 1;
    }
    if(!this.gamePad.buttons[this.hotBarMinus].pressed){
      this.leftDebouce = true;
    }
    return delta;
  }

  getCursor(){
    let clone = {
      x: this.cursor.x,
      y: this.cursor.y,
      click: this.cursor.click,
      target: this.cursor.target
    }
    this.cursor.click = false;
    return clone;
  }

  getStartButton(){
    return this.gamePad.buttons[this.start].pressed;
  }

  isStabbing(){
    return this.gamePad.buttons[this.attack].pressed;
  }

}

export default ControllerInputMethod;
