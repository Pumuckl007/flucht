
/**
* a class used to get all the input values from the Keyboard and mouse
*/
class KMInputMethod{

  constructor(){
    this.keys = [];
    this.listeners = [];
    let self = this;
    window.onkeyup = function(e) {
      self.keys[e.keyCode] = false;
    }
    window.onkeydown = function(e) {
      self.keys[e.keyCode] = true;
    }

    this.cursor = {
      x : 0,
      y : 0,
      clicked : false,
      target: ""
    }

    this.stabDebounce = true;

    document.getElementById("Body").onmousemove = function(e){
      self.onMouseMove(e);
    }
    document.getElementById("Body").onclick = function(e){
      self.onClick(e);
    }
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
    for(let listener of this.listeners){
      listener.onInput(this);
    }
  }

  getXMovement(){
    if(this.keys[65] || this.keys[37]){
      return -1;
    } else if(this.keys[68] || this.keys[39]){
      return 1;
    } else {
      return 0;
    }
  }

  getYMovement(){
    if(this.keys[83] || this.keys[40]){
      return -1;
    } else if(this.keys[87] || this.keys[38]){
      return 1;
    } else {
      return 0;
    }
  }

  jumpPushed(){
    return this.keys[32];
  }

  crouchHeld(){
    return this.keys[83];
  }

  getHotbarPosSet(){
    for(let key = 48; key<58; key++){
      if(this.keys[key]){
        let index = key - 48;
        if(index === 0){
          index = 10;
        }
        index --;
        return index;
      }
    }
    return false;
  }

  getHotbarPosDelta(){
    return 0;
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
    return false;
  }

  isStabbing(){
    return this.keys[81];
  }

}

export default KMInputMethod;
