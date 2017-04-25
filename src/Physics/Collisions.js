/**
 * A module used for collision detection
 * @module Physics/Collisions
 */

/**
Finds any collisions between the terrain elements and the entity and calls the respective methods.
After finding a collision if the entity returns true and the terrain element returns true
the position of the entity will not be corrected, if both return false then the entity will be.
@param {Terrain} terrain the terrain who's elements to check collisiosn against.
@param {Entity} entity the entity to use for collision detection
*/
function terrainAndEntity(terrain, entity){
  for(let terrainElement of terrain.elements){
    if(terrainElement.ghost){
      continue;
    }
    let xOff = terrainElement.pos.x-entity.pos.x;
    let yOff = terrainElement.pos.y- entity.pos.y;
    let side = 0;
    if((side = terrainElement.box.intersects(entity.box, xOff, yOff)) !== 0){
      let overlap = terrainElement.box.getOverlap(entity.box, xOff, yOff);
      let oldX = entity.pos.x;
      let oldY = entity.pos.y;
      let oldVelX = entity.vel.x;
      let oldVelY = entity.vel.y;
      if(overlap[0] > overlap[1]){
        side = 2;
        side += correctY(entity, terrainElement, yOff);
      } else {
        side = 1;
        side += correctX(entity, terrainElement, xOff);
      }
      let bool = terrainElement.collision(entity, side, oldX, oldY) || terrainElement.dontMoveOnCollision;
      if(bool || entity.collision(terrainElement, side)){
        entity.pos.x = oldX;
        entity.pos.y = oldY;
        entity.vel.x = oldVelX;
        entity.vel.y = oldVelY;
      }
    }
  }
}

/**
Corrects the x direction of the entity returning which direction it was corrected, left = 2, right = 0
@param {Entity} toMove the entity to check and to move
@param {Entity} notToMove the entity to check and not to move
@param {number} xOff the offset in the x direction of the two elements, how far further left the notToMove is.
*/
function correctX(toMove, notToMove, xOff){
  let direction = 0;
  if(xOff !== 0)
    direction = -Math.abs(xOff)/xOff;
  else
    return 0;
  toMove.vel.x = 0;
  toMove.pos.x = notToMove.pos.x + direction*(toMove.box.width/2 + notToMove.box.width/2);
  return (direction < 0) ? 2 : 0;
}

/**
Corrects the y direction of the entity returning which direction it was corrected, down = 2, up = 0
@param {Entity} toMove the entity to check and to move
@param {Entity} notToMove the entity to check and not to move
@param {number} yOff the offset in the y direction of the two elements, how far further up the notToMove is.
*/
function correctY(toMove, notToMove, yOff){
  let direction = 0;
  if(yOff !== 0)
    direction = -Math.abs(yOff)/yOff;
  else {
    return 0;
  }
  toMove.vel.y = 0;
  toMove.pos.y = notToMove.pos.y + direction*(toMove.box.height/2 + notToMove.box.height/2);
  return (direction < 0) ? 2 : 0;
}

export default {terrainAndEntity: terrainAndEntity, correctX: correctX, correctY: correctY};
