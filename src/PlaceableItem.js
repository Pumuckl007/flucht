/**
* An item that can be placed and shows up in the hot bar
*/
class PlaceableItem{

  /**
  * creates a new placeable item with the information used to place it
  * @constructor
  */
  constructor(trap, displayImage){
    this.trap = trap;
    this.displayImage = displayImage;
  }

  /**
  * returns whether a trap can be placed There
  */
  canPlace(room, pos){
    return true;
  }

  /**
  *  @return {String} the url to the image to be displayed for the hot bar
  */
  getDisplayImageURL(){
    return this.displayImage;
  }

}

export default PlaceableItem;
