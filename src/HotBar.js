
/**
* a class to manage the hot bar for the murderer or others, items and current postion
* as well as listening for keyboard commands to specify which slot is selected
*/
class HotBar{

  /**
  * creates a new hot bar, always has 10 slots [0,9]
  * @constructor
  */
  constructor(numberOfSlots){
    /**
    * the string for the event fired when a slot is changed
    */
    this.SLOT_CHANGED = "slotChanged";

    /**
    * the string for when an item in the specified slot is changed
    */
    this.ITEM_CHANGED = "Item Changed";

    this.items = [];
    this.currentSelected = 0;
    this.listeners = [];
  }

  /**
   *@param {number} slot the slot index
  * @return {Item} item the item in the slot
  */
  getItemInSlot(slot){
    return this.items[slot];
  }

  /**
   *@param {number} slot the slot index
  * @return {boolean} empty returns if the slot is currently empty
  */
  isSlotEmpty(slot){
    if(this.items[slot]){
      return true;
    } else {
      return false;
    }
  }

  /**
  * @return {number} selectedIndex returns the index of the slected slot
  */
  getSelectedSlot(){
    return this.currentSelected;
  }

  /**
  * adds a listener to the hot bar
  * @param {Object} listener the listener
  * @param {Function} listener.onEvent the method called when an event is fired
  */
  addChangeListener(listener){
    this.listeners.push(listener);
  }

  /**
  * private, called when the listeners should be notified
  * @param {String} event the event that has occured
  * @param {Object} data extra data if it is desired
  */
  notifyObservers(event, data){
    for(let listener of this.listeners){
      listener.onEvent(event);
    }
  }

}

export default HotBar;
