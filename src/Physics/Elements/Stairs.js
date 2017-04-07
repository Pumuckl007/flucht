import SideJump from "./SideJump.js";
/**
 * A module used for collision detection
 * @module Physics/Entities/Stairs
 */

/**
* creates stair blocks to create a stairwell
* @param {Object[]} args array that holds values that represent top, height and size of stairs
* @returns {Element[]} retruns array full of Side Jump elements
*/
function generator(args){
  let top = args[0];
  let height = args[1];
  let size = args[2];
  let elements = [];
  for(let i = 0; i<height/size; i++){
    let x = top-((0.5 + i)*size);
    let y = height - (0.5+i)*size;
    elements.push(new SideJump(x, y, size, size));
  }
  return elements;
}

export default generator;
