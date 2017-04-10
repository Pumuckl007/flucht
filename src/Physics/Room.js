import Box from "./Box.js"
import BuildWall from "./BuildWall.js";
import ElementMap from "./Elements/ElementMap.js";

/**
* A class representative of a given room at cooridnates x, y, with a discription
*/
class Room{

  /**
  * creates a new room at x, y with discription discription.
  * @constructor
  * @param {number} x the x position of the room.
  * @param {number} y the y position of the room.
  * @param {Object} description the discription of the room.
  */
  constructor(x, y, description){
    this.elements = [];
    this.x = x;
    this.y = y;
    this.box = new Box(description.width + 20, description.height + 20);
    this.description = description;
    this.types = {
      left: [],
      right: [],
      top: [],
      bottom: []
    }
  }

  /**
  * Generates the walls for a room
  */
  generateWalls(){

    let right = BuildWall(0, this.box.height-20, false, this.types.right);
    this.mirror(right, false);
    let up = BuildWall(-10, this.box.width-10, true, this.types.top);
    this.mirror(up, true);
    if(this.description.leftEntrance){
      let left = BuildWall(0, this.box.height-20, false, [{
        "location": "left",
        "position": 0,
        "width": 200
      }]);
      this.elements = this.elements.concat(left);
    } else {
      let left = BuildWall(0, this.box.height-20, false, []);
      this.elements = this.elements.concat(left);
    }
    if(this.description.rightEntrance){
      let right = BuildWall(0, this.box.height-20, false, [{
        "location": "right",
        "position": 0,
        "width": 200
      }]);
      this.mirror(right, false);
      this.elements = this.elements.concat(right);
    } else {
      let right = BuildWall(0, this.box.height-20, false, []);
      this.mirror(right, false);
      this.elements = this.elements.concat(right);
    }
    if(this.description.topEntrance){
      let top = BuildWall(-10, this.box.width-10, true, [{
        "location": "top",
        "position": this.box.height-120,
        "width": 240
      }]);
      this.mirror(top, true);
      this.elements = this.elements.concat(top);
    } else {
      let top = BuildWall(-10, this.box.width-10, true, []);
      this.mirror(top, true);
      this.elements = this.elements.concat(top);
    }
    if(this.description.bottomEntrance){
      let bottom = BuildWall(-10, this.box.width-10, true, [{
        "location": "bottom",
        "position": this.box.height-120,
        "width": 240
      }]);
      this.elements = this.elements.concat(bottom);
    } else {
      let bottom = BuildWall(-10, this.box.width-10, true, []);
      this.elements = this.elements.concat(bottom);
    }
    let dX = this.box.width/2-this.x;
    let dY = this.box.height/2-this.y;
    this.generateElements();
    for(let element of this.elements){
      element.pos.x -= dX;
      element.pos.y -= dY;
    }
  }

  /**
  * Generates the elements in the room
  */
  generateElements(){
    for(let element of this.description.elements){
      let built = new ElementMap[element.type](element.x, element.y, element.width, element.height, element);
      this.elements.push(built);
    }
    if(!this.description.specialElements){
      return;
    }
    for(let element of this.description.specialElements){
      let built = ElementMap[element.type](element.args);
      this.elements = this.elements.concat(built);
    }
  }

  /**
  * Mirrors an element over the x or y axis of the room.
  * @param {Element[]} elements the elements to mirror
  * @param {boolean} x whether or not the mirror is over the x-axis
  */
  mirror(elements, x){
    for(let element of elements){
      if(!x){
        element.pos.x += this.box.width-10;
      } else {
        element.pos.y += this.box.height-10;
      }
    }
  }
}

export default Room;
