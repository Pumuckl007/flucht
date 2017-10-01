import TrapGhost from "./TrapGhost.js";

/**
* a class housing the logic for the murder editor
*/
class MurderEditor{

  constructor(flucht, hotBar, world){
    this.enabled = true;
    this.x = 0;
    this.y = 0;
    this.flucht = flucht;
    this.hotBar = hotBar;
    this.world = world;
    let self = this;
    this.additions = [];
    this.trapGhost = new TrapGhost();
    this.id = 10;
    this.vx = 0;
    this.vy = 0;
    this.trapsLeft = 30;
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
    if(key > 47 && key < 58){
      let slot = key - 48;
      if(slot === 0){
        slot = 10;
      }
      slot --;
      if(!this.hotBar.isSlotEmpty(slot)){
        this.trapGhost.show();
        this.trapGhost.setElement(this.hotBar.getItemInSlot(slot));
      } else {
        this.trapGhost.hide();
      }
    }
  }

  /**
  * called when the mouse moves
  */
  onMouseMove(cursor){
    let slot = this.hotBar.getSelectedSlot();
    if(!this.hotBar.isSlotEmpty(slot)){
      this.trapGhost.show();
      this.element = this.hotBar.getItemInSlot(slot);
      this.trapGhost.setElement(this.element);
      this.trapGhost.setPos(cursor.x, cursor.y);
      let pos = {
        x: this.x + (cursor.x-window.innerWidth/2),
        y: this.y - (cursor.y-window.innerHeight/2)
      };
      let resultOfCanplace = this.element.canPlace(this.world, pos, this.getRoom(pos));
      if(resultOfCanplace){
        let reverseX = resultOfCanplace.x - this.x + window.innerWidth/2;
        let reverseY = -resultOfCanplace.y + this.y + window.innerHeight/2;
        this.trapGhost.setPos(reverseX, reverseY);
        this.trapGhost.setValidity(true);
      } else {
        this.trapGhost.setValidity(false);
      }
    } else {
      this.trapGhost.hide();
    }
  }

  /**
  * called when the mouse moves
  */
  onClick(cursor){
    if(this.trapsLeft < 1){
      return;
    }
    if(cursor.target !== "MurderEditor"){
      return;
    }
    let slot = this.hotBar.getSelectedSlot();
    if(!this.hotBar.isSlotEmpty(slot)){
      this.trapGhost.show();
      this.element = this.hotBar.getItemInSlot(slot);
      this.trapGhost.setElement(this.element);
      this.trapGhost.setPos(cursor.x, cursor.y);
      let pos = {
        x: this.x + (cursor.x-window.innerWidth/2),
        y: this.y - (cursor.y-window.innerHeight/2)
      };
      let resultOfCanplace = this.element.canPlace(this.world, pos, this.getRoom(pos));
      if(resultOfCanplace){
        pos = resultOfCanplace;
        let json = this.element.place(this.world, pos, this.id++);
        this.additions.push(json);
        this.trapsLeft --;
      }
    } else {
      this.trapGhost.hide();
    }
  }

  /**
  * returns the room corrisponding to the position provided
  */
  getRoom(pos){
    if(!this.world.terrain.rooms){
      return false;
    }
    for(let room of this.world.terrain.rooms){
      let soFar = pos.x > (room.x-room.box.width/2);
      soFar = soFar && pos.x < (room.x + room.box.width/2);
      soFar = soFar && pos.y > (room.y - room.box.height/2);
      soFar = soFar && pos.y < (room.y + room.box.height/2);
      if(soFar){
        return room;
      }
    }
    return false;
  }

  /**
  * called once every 20ms
  */
  update(){
    if(this.enabled){
      this.y += this.vy;
      this.x += this.vx;
      this.viewChanged({x: this.x, y:this.y});
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
    this.trapGhost.hide();
  }

  /**
  * called to enabled the editor
  */
  enable(){
    this.trapsLeft = 30;
    this.enabled = true;
    this.viewChanged({enableChanged: true});
    this.x = 0;
    this.y = 0;
    this.viewChanged({x: this.x, y:this.y});
  }

  /**
  * @return {Array<JSONObject>} an array of json object which represent the new traps
  */
  getAdditions(){
    return this.additions;
  }

  /**
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    if(!this.enabled){
      return;
    }
    this.vx = 20*inputMethod.getXMovement();
    this.vy = 20*inputMethod.getYMovement();
    this.cursor = inputMethod.getCursor();
    if(this.cursor.click){
      this.onClick(this.cursor);
    } else {
      this.onMouseMove(this.cursor);
    }
  }

}

export default MurderEditor;
