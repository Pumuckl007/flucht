
/**
* a class to manage the hot bar for there will be a lot of dom manipulation that is required
*/
class HotBarUI{

  /**
  * creates a new HotBarUI
  * @constructor
  * @param {HotBar} hotBar the hot bar object which the UI should represent
  */
  constructor(hotBar){
    this.hotBarTable = document.getElementById("HotBar");
    this.hotBarCells = [];
    for(let i = 0; i < 10; i++){
      this.hotBarCells[i] = document.getElementById("HotBar" + i);
    }
    this.visible = true;
    this.hotBar = hotBar;
    this.pos = -1;
    this.hotBar.addChangeListener(this);
  }

  /**
  * called when an event from the hot bar happens
  * @param {String} event the hot bar event
  * @param {object} data data associated with the event
  */
  onEvent(event, data){
    if(event === this.hotBar.ITEM_CHANGED){

    }
    if(event === this.hotBar.SLOT_CHANGED){
      if(data !== this.pos){
        this.deselect(this.pos);
        this.pos = data;
        this.select(data);
      }
    }
  }

  /**
  * used to select cell
  * @param {number} cellIndex the index of the cell cell to select
  */
  select(cellIndex){
    if(cellIndex > 0 && cellIndex < 10){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "solid 2px red";
      prev.style["border-right"] = "solid 2px red";
    } else if(cellIndex === 0){
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "solid 2px red";
    }

  }

  /**
  * used to deselect cell
  * @param {number} cellIndex the index of the cell cell to select
  */
  deselect(cellIndex){
    if(cellIndex > 0 && cellIndex < 9){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      cell.style["border-right"] = "solid 2px #999999";
      prev.style["border-right"] = "solid 2px #999999";
    } else if(cellIndex === 0){
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      cell.style["border-right"] = "solid 2px #999999";
    } else if(cellIndex === 9){
      let prev = this.hotBarCells[cellIndex - 1];
      let cell = this.hotBarCells[cellIndex];
      cell.style.border = "none";
      prev.style["border-right"] = "solid 2px #999999";
    }
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
      let index = key - 48;
      if(index === 0){
        index = 10;
      }
      index --;
      this.hotBar.setSelectedSlot(index);
    }
  }

}

export default HotBarUI;
