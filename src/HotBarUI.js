
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
    this.hotBar.addListener(this);
  }

  /**
  * called when an event from the hot bar happens
  * @param {String} event the hot bar event
  * @param {object} data data associated with the event
  */
  onEvent(event, data){
    if(event === this.hotBar.ITEM_CHANGED){

    }
  }

}

export default HotBarUI;
