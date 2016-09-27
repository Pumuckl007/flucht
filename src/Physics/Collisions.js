function terrainAndEntity(terrain, entity){
  for(let terrainElement of terrain.elements){
    let xOff = terrainElement.pos.x-entity.pos.x;
    let yOff = terrainElement.pos.y- entity.pos.y;
    let side = 0;
    if((side = terrainElement.box.intersects(entity.box, xOff, yOff)) !== 0){
      let overlap = terrainElement.box.getOverlap(entity.box, xOff, yOff);
      if(overlap[0] > overlap[1]){
        side = 2;
        side += correctY(entity, terrainElement, yOff);
      } else {
        side = 1;
        side += correctX(entity, terrainElement, xOff);
      }
      terrainElement.collision(entity, side);
      entity.collision(terrainElement, side);
    }
  }
}

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
