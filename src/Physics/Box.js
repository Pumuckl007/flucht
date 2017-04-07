/**
A class that represents a box for collision detection
*/
class Box{
  /**
  * creates A box with given width an height
  * @constructor
  * @param {number} width width of the box
  * @param {number} height height of the box
  */
  constructor(width, height){
    this.height = height;
    this.width = width;
  }

  /**
  * checks if there is a collision the box intersects another box
  * @param {Box} box the other box
  * @param {number} xOff the x offset for the other box
  * @param {number} yOff the y offset for the other box
  * @returns {boolean} returns true if the boxes are intersecting
  */
  intersects(box, xOff, yOff){
    let value = 0;
    if(Math.abs(yOff)*2 < box.height + this.height&&Math.abs(xOff)*2 < box.width + this.width){
      value = 3;
      if(this.height/2 > Math.abs(yOff)-box.height/2 && this.height/2 < Math.abs(yOff)+box.height/2){
        value --;
      }
      if(this.width/2 > Math.abs(xOff)-box.width/2 && this.width/2 < Math.abs(xOff)+box.width/2){
        value -=2;
      }
      return (value <= 0) ? 3 : value;
    }
    return value;
  }

  /**
  * returns the amount of overlap between two boxes in the x and y axis [0, width], [0, height]
  * @param {Box} box the other box
  * @param {number} xOff the x offset for the other box
  * @param {number} yOff the y offset for the other box
  * @returns {number[]} returns the x and y overlap as an array [x, y]
  */
  getOverlap(box, xOff, yOff){
    let xOver = box.width/2 - (Math.abs(xOff)-this.width/2);
    let yOver = box.height/2 - (Math.abs(yOff)-this.height/2);
    return [Math.max(xOver, 0), Math.max(yOver, 0)];
  }
}

export default Box;
