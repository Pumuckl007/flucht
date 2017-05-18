import TrapGhost from "./TrapGhost.js";

/**
* a class housing the logic for the murder editor
*/
class MurderEditor{

  constructor(flucht, hotBar){
    this.enabled = true;
    this.x = 0;
    this.y = 0;
    this.flucht = flucht;
    this.hotBar = hotBar;

    let self = this;
    document.getElementById("MurderEditor").onmousemove = function(e){
      self.onMouseMove(e);
    }

    this.trapGhost = new TrapGhost();
  }

  /**
  * called when key is pressed
  * @param {number} key the ascii value of the key pressed
  * @param {boolean} pressed whether or not the key was pressed or released
  */
  onKey(key, pressed){
    if(!pressed){
      return;
    }

  }

  /**
  * called when the mouse moves
  */
  onMouseMove(event){
    let slot = this.hotBar.getSelectedSlot();
    if(!this.hotBar.isSlotEmpty(slot)){
      this.trapGhost.show();
      this.trapGhost.setElement(this.hotBar.getItemInSlot(slot));
    } else {
      this.trapGhost.hide();
    }
  }

  /**
  * called once every 20ms
  */
  update(){
    if(this.enabled){
      if(keys[87]){
        this.y += 10;
        this.viewChanged({x: this.x, y:this.y});
      }
      if(keys[83]){
        this.y -= 10;
        this.viewChanged({x: this.x, y:this.y});
      }
      if(keys[65]){
        this.x -= 10;
        this.viewChanged({x: this.x, y:this.y});
      }
      if(keys[68]){
        this.x += 10;
        this.viewChanged({x: this.x, y:this.y});
      }
    }
  }

  /**
  * called when an event is to be dispatched
  * @param {Object} data the data to use
  */
  viewChanged(data){
    this.flucht.murderEditorChanged(data);
  }

  /**
  * called to disabled the editor
  */
  disable(){
    this.enabled = false;
    this.viewChanged({enableChanged: true});
  }

  /**
  * called to enabled the editor
  */
  enable(){
    this.enabled = true;
    this.viewChanged({enableChanged: true});
    this.x = 0;
    this.y = 0;
    this.viewChanged({x: this.x, y:this.y});
  }

}

export default MurderEditor;
