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
  canPlace(world, pos, room){
    this.trap.pos = pos;
    if(room){
      let least = false;
      let viablePos = false;
      for(let element of room.elements){
        if(element.type !== "Element"){
          continue;
        }
        let viable = this.determinViable(pos, element, world);
        if(!least){
          least = viable.dist;
          viablePos = viable;
        }
        if(viable.dist < least){
          least = viable.dist;
          viablePos = viable;
        }
      }
      if(viablePos && least <= 50){
        this.trap.pos = {x: viablePos.x, y:viablePos.y};
        return this.trap.pos;
      }
    }
    return false;
  }

  /**
  * determins whether or not a placement is viable, as in whether it can be
  * corrected or not
  */
  determinViable(pos, element, world){
    if(element.box.width <= element.box.height*2){
      return false;
    }
    let left = element.pos.x - element.box.width/2 + this.trap.box.width/2;
    let right = element.pos.x + element.box.width/2 - this.trap.box.width/2;
    let height = element.pos.y;
    let bestX = pos.x;
    if(bestX < left){
      bestX = left;
    }
    if(bestX > right){
      bestX = right;
    }
    let bestY = height + element.box.height/2 + this.trap.box.height/2 + 0.01;
    let oldTrapPos = this.trap.pos;
    this.trap.pos = {x: bestX, y:bestY};
    let collision = world.doesTerrainCollide(this.trap);
    if(collision){
      return false;
    }
    this.trap.pos = oldTrapPos;
    let dist = Math.sqrt(Math.pow(pos.x - bestX, 2)
      + Math.pow(pos.y - bestY, 2));
    let data = {x: bestX, y: bestY, dist: dist};
    return data;
  }

  place(world, pos, id){
    this.trap.pos = pos;
    this.trap.pos.y -= this.trap.box.height/2;
    let w = this.trap.box.width;
    let h = this.trap.box.height;
    // this.trap.box.width = 1;
    // this.trap.box.height = 1;
    let clonedTrap = this.trap.clone();
    clonedTrap.id = id;
    world.addElement(clonedTrap);
    let json = JSON.stringify(clonedTrap);
    this.trap.box.width = w;
    this.trap.box.height = h;
    return json;

  }

  /**
  *  @return {String} the url to the image to be displayed for the hot bar
  */
  getDisplayImageURL(){
    return this.displayImage;
  }

}

export default PlaceableItem;
