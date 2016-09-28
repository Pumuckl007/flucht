import Element from "./Elements/Element.js";
import Box from "./Box.js";
import BuildWall from "./BuildWall.js";
import ElementMap from "./Elements/ElementMap.js";

function generateLevel(urlToDescription, callback){
  httpRequest(urlToDescription, generate, callback);
}

function generate(levelDescription, callback){
  let i = levelDescription.rooms.length;
  let avaliableRooms = [];
  for(let room of levelDescription.rooms){
    httpRequest(room.url, function(data){
      i--;
      if(levelDescription.generatorData){
        data.generatorData = levelDescription.generatorData;
      }
      if(i <= 0){
        avaliableRooms.push(data);
        build(avaliableRooms, levelDescription, callback);
      } else {
        avaliableRooms.push(data);
      }
    });
  }
}

function build(avaliableRooms, levelDescription, callback){
  let width = 0;
  let height = 0;
  let absValues = [0,0,0,0];
  let avaliableStarts = [];
  let x = 0;
  let y = 0;
  let roomDef = avaliableRooms[Math.floor(Math.random()*avaliableRooms.length)];
  let room = new Room(x, y, roomDef);
  let rooms= [room];
  absValues[0] = Math.min(absValues[0], x-room.box.width/2);
  absValues[1] = Math.max(absValues[1], x+room.box.width/2);
  absValues[2] = Math.min(absValues[2], y-room.box.height/2);
  absValues[3] = Math.max(absValues[3], y+room.box.height/2);
  width = absValues[1]-absValues[0];
  height = absValues[3]-absValues[2];
  for(let start of roomDef.gateways){
    let xAndY = findLocation(start, room);
    avaliableStarts.push({"location": start.location,
    x:xAndY[0], y:xAndY[1]})
  }

  let complementary = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
  }

  let i = 500;
  while((width < levelDescription.width || height < levelDescription.height) && i > 0){
    i--;
    roomDef = avaliableRooms[Math.floor(Math.random()*avaliableRooms.length)];
    let startPoint = avaliableStarts[Math.floor(Math.random()*avaliableStarts.length)];
    room = new Room(0, 0, roomDef);
    let otherStartPoints = room.types[complementary[startPoint.location]].slice(0);
    while(otherStartPoints.length > 0){
      let index = Math.floor(Math.random()*otherStartPoints.length);
      let start = otherStartPoints[index];
      otherStartPoints.splice(index, 1);
      let xAndY = findLocation(start, room);
      room.x = startPoint.x - xAndY[0];
      room.y = startPoint.y - xAndY[1];
    }

    if((room.x === 0 && room.y === 0) || roomIntersectsRooms(room, rooms)){
      continue;
    }

    absValues[0] = Math.min(absValues[0], room.x-room.box.width/2);
    absValues[1] = Math.max(absValues[1], room.x+room.box.width/2);
    absValues[2] = Math.min(absValues[2], room.y-room.box.height/2);
    absValues[3] = Math.max(absValues[3], room.y+room.box.height/2);
    width = absValues[1]-absValues[0];
    height = absValues[3]-absValues[2];
    rooms.push(room);

    for(let start of roomDef.gateways){
      let xAndY = findLocation(start, room);
      avaliableStarts.push({"location": start.location,
      x:xAndY[0]+room.x, y:xAndY[1]+room.y})
    }
  }

  let elements = [];

  for(let room of rooms){
    room.generateWalls();
    elements = elements.concat(room.elements);
  }

  callback(elements);
}

function roomIntersectsRooms(room, rooms){
  for(let roomToCheck of rooms){
    if(room.box.intersects(roomToCheck.box, roomToCheck.x- room.x, roomToCheck.y - room.y) !== 0){
      return true;
    }
  }
  return false;
}

function findLocation(gateway, room){
  let x = (gateway.location === "right") ? room.box.width/2 : ((gateway.location==="left") ? -room.box.width/2 : 0);
  let y = (gateway.location === "top") ? room.box.height/2 : ((gateway.location==="bottom") ? -room.box.height/2 : 0);
  if(gateway.location === "top" || gateway.location === "bottom"){
    x += -room.box.width/2 + 10 + gateway.position + gateway.width/2;
  } else {
    y += -room.box.height/2 + 10 + gateway.position + gateway.width/2;
  }
  return [x, y];
}

class Room{
  constructor(x, y, description){
    this.elements = [];
    this.x = x;
    this.y = y;
    this.box = new Box(description.width + 20, description.height + 20);
    this.gateways = description.gateways;
    this.description = description;
    this.types = {
      left: [],
      right: [],
      top: [],
      bottom: []
    }
    for(let gateway of this.gateways){
      let array = this.types[gateway.location];
      if(array.length === 0){
        array.push(gateway);
        continue;
      }
      let i = 0;
      while(i < array.length && array[i].position < gateway.position){
        i++;
      }
      array.splice(i, 0, gateway);
    }
  }

  generateWalls(){

    let right = BuildWall(0, this.box.height-20, false, this.types.right);
    this.mirror(right, false);
    let up = BuildWall(-10, this.box.width-10, true, this.types.top);
    this.mirror(up, true);
    this.elements = this.elements.concat(right);
    this.elements = this.elements.concat(up);
    this.elements = this.elements.concat(BuildWall(0, this.box.height-20, false, this.types.left));
    this.elements = this.elements.concat(BuildWall(-10, this.box.width-10, true, this.types.bottom));
    let dX = this.box.width/2-this.x;
    let dY = this.box.height/2-this.y;
    this.generateElements();
    for(let element of this.elements){
      element.pos.x -= dX;
      element.pos.y -= dY;
    }
  }

  generateElements(){
    for(let element of this.description.elements){
      let built = new ElementMap[element.type](element.x, element.y, element.width, element.height);
      this.elements.push(built);
    }
  }

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



function httpRequest(url, callback, passArg){
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        callback(JSON.parse(httpRequest.responseText), passArg)
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.setRequestHeader('Content-Type', 'text/json');
  httpRequest.send();
}

export default generateLevel;
