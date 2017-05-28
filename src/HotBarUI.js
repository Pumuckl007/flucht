
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
    for(let i = 0; i<10; i++){
      if(!this.hotBar.isSlotEmpty(i)){
        this.onEvent(this.hotBar.ITEM_CHANGED, {index: i, item: this.hotBar.getItemInSlot(i)});
      }
    }
  }

  /**
  * called when an event from the hot bar happens
  * @param {String} event the hot bar event
  * @param {object} data data associated with the event
  */
  onEvent(event, data){
    if(event === this.hotBar.ITEM_CHANGED){
      let cell = this.hotBarCells[data.index];
      cell.style.backgroundImage = "url(" + data.item.getDisplayImageURL() + ")";
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
  * called every time the inputMethod polls the input
  * @param {InputMethod} inputMethod the input method
  */
  onInput(inputMethod){
    let pos = inputMethod.getHotbarPosSet();
    if(pos){
      this.hotBar.setSelectedSlot(pos);
    } else {
      let delta = inputMethod.getHotbarPosDelta();
      let oldPos = this.hotBar.getSelectedSlot();
      oldPos += delta;
      oldPos = oldPos % 10;
      if(oldPos < 0){
        oldPos = 9;
      }
      this.hotBar.setSelectedSlot(oldPos);
    }
  }

}

export default HotBarUI;
