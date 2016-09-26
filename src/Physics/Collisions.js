function terrainAndEntity(terrain, entity){
  for(let terrainElement of terrain.elements){
    let xOff = terrainElement.pos.x-entity.pos.x;
    let yOff = terrainElement.pos.y- entity.pos.y;
    let side = 0;
    if((side = terrainElement.box.intersects(entity.box, xOff, yOff)) !== 0){
      if(side === 3){
        correctX(entity, terrainElement);
        correctY(entity, terrainElement);
      } else if(side === 2){
        correctY(entity, terrainElement);
      } else if(side === 1){
        correctX(entity, terrainElement);
      }
      terrainElement.collision(entity, side);
      entity.collision(terrainElement, side);
    }
  }
}

function correctX(toMove, notToMove){
  if(toMove.vel.x === 0)
    return;
  let direction = -Math.abs(toMove.vel.x)/toMove.vel.x;
  toMove.vel.x = 0;
  toMove.pos.x = notToMove.pos.x + direction*(toMove.box.width/2 + notToMove.box.width/2);
}

function correctY(toMove, notToMove){
  if(toMove.vel.y === 0)
    return;
  let direction = -Math.abs(toMove.vel.y)/toMove.vel.y;
  toMove.vel.y = 0;
  toMove.pos.y = notToMove.pos.y + direction*(toMove.box.height/2 + notToMove.box.height/2);
}

export default {terrainAndEntity: terrainAndEntity, correctX: correctX, correctY: correctY};
