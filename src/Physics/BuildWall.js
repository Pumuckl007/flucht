import Element from "./Elements/Element.js";
/**
 * A module used for building walls
 * @module Physics/BuildWall
 */

/**
Builds the wall for a room with the given gateways
@param {numbeer} start the coordinate to start at
@param {number} end the coordinate to end at
@param {boolean} x if the wall is along the x-axis
@param {Gateway[]} gateways a list of gateways
@return {Element[]} the wall elements of type element
*/
function buildWall(start, end, x, gateways){
  let elements = [];
  if(gateways.length < 1){
    let center = (start+end)/2;
    let breath = end - start;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10))
    return elements;
  }
  let allLeft = start;
  let left = gateways[0].position;
  let right = left-1;
  for(let i = 0; i<gateways.length; i++){
    if(gateways[i].position <= right+1){
      right = gateways[i].position + gateways[i].width;
    } else {
      if(left - allLeft > 1){
        let center = (allLeft+left)/2;
        let breath = left - allLeft;
        elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10))
      }
      allLeft = right;
      left = gateways[i].position;
      right = left + gateways[i].width;
    }
  }
  if(left - allLeft > 1){
    let center = (allLeft+left)/2;
    let breath = left - allLeft;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10))
  }
  if(end - right > 1){
    let center = (end+right)/2;
    let breath = end - right;
    elements.push(new Element(x ? center : -5, (!x) ? center : -5, x ? breath : 10, (!x) ? breath : 10))
  }
  return elements;
}

export default buildWall;
