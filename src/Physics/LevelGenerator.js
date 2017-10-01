import Element from "./Elements/Element.js";
import Room from "./Room.js"
/**
 * A module used for level generation
 * @module Physics/LevelGenerator
 */

 /**
 * generates the level with the given url to the discription and callback
 * @param {String} urlToDescription the url for the level json
 * @param {function} callback the callback
 */
function generateLevel(urlToDescription, callback, random){
  let discription = false;
  let waitUntilDone = function(levelDiscription){
    if(!discription){
      discription = levelDiscription;
      let rooms = discription.roomTypes;
      rooms = rooms.slice(0);
      if(levelDiscription.exitRoom){
        rooms.push(levelDiscription.exitRoom.url);
      }
      if(levelDiscription.keyRoom){
        rooms.push(levelDiscription.keyRoom.url);
      }
      loadAllToCache(rooms);
    }
    if(allDoneLoadingLevels){
      generate(discription, callback, random);
    } else {
      setTimeout(waitUntilDone, 10);
    }
  }
  httpRequest(urlToDescription, waitUntilDone);
}

/**
* generates the level with the given discription and callback
* @param {LevelDiscription} levelDescription the level discription object
* @param {Room[]} levelDescription.rooms the rooms of the level
* @param {function} callback the callback
*/
function generate(levelDescription, callback, random){
  let i = levelDescription.rooms.length;
  if(levelDescription.exitRoom){
    i+=2;
  }
  let avaliableRooms = [];
  let roomMinMax = {};
  let callbackLocal = function(data, room){
    i--;

    if(levelDescription.generatorData){
      data.generatorData = levelDescription.generatorData;
    }
    if(i <= 0){
      avaliableRooms.push(data);
      roomMinMax[data.name] = room;
      build(avaliableRooms, levelDescription, callback, roomMinMax, random);
    } else {
      avaliableRooms.push(data);
      roomMinMax[data.name] = room;
    }
  };
  for(let room of levelDescription.rooms){
    httpRequest(room.url, callbackLocal, room);
  }
  if(levelDescription.exitRoom){
    httpRequest(levelDescription.exitRoom.url, callbackLocal, levelDescription.exitRoom);
    httpRequest(levelDescription.keyRoom.url, callbackLocal, levelDescription.keyRoom);
  }
}

/**
* generates the level with the given discription and callback.
* It Generates the rooms by creating a list of avaliable spots on a level, then iterating over the rooms which have minimums until
* the rooms have been placed, the leftover are filled by trying to place a rooms
* using [tryToPlace]{@link #tryToPlace} until one returns true.
* @param {RoomDiscription[]} avaliableRooms the avaliable rooms
* @param {LevelDiscription} levelDiscription the level Discription
* @param {function} callback the callback for when finished
* @param {Object} roomMinMaxMap a map between a roomName and a minimum and maximum number of that room.
*/
function build(avaliableRooms, levelDescription, callback, roomMinMaxMap, random){
  let avaliableRoomMap = {};
  let spawns = [];
  for(let room of avaliableRooms){
    avaliableRoomMap[room.name] = room;
  }

  let complementary = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
  }

  let roomGrid = [];
  let rooms = [];
  for(let i = 0; i<levelDescription.width; i++){
    roomGrid[i] = [];
  }

  let avaliableSpots = [];
  for(let w = 0; w<levelDescription.width; w++){
    avaliableSpots.push(w);
  }
  if(levelDescription.exitRoom){
    let w = Math.floor(random()*levelDescription.width);
    let h = Math.floor(random()*levelDescription.height);
    let roomToPlace = avaliableRoomMap[levelDescription.exitRoom.name];
    tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns);
    let index = avaliableRooms.indexOf(roomToPlace);
    avaliableRooms.splice(index, 1);
  }
  if(levelDescription.keyRoom){
    while(true){
      let w = Math.floor(random()*levelDescription.width);
      let h = Math.floor(random()*levelDescription.height);
      let roomToPlace = avaliableRoomMap[levelDescription.keyRoom.name];
      if(!tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns)){
        continue;
      }
      let index = avaliableRooms.indexOf(roomToPlace);
      avaliableRooms.splice(index, 1);
      break;
    }
  }
  for(let h = 0; h<levelDescription.height; h++){
    let localAvaliableSpots = avaliableSpots.slice(0);
    for(let roomName in roomMinMaxMap){
      let min = roomMinMaxMap[roomName].min;
      if(!min){
        continue;
      }
      for(let i = 0; i<min && localAvaliableSpots.length > 0; i++){
        let index = Math.floor(random()*localAvaliableSpots.length);
        let posToPlaceAt = localAvaliableSpots[index];
        localAvaliableSpots.splice(index, 1);
        let roomToPlace = avaliableRoomMap[roomName];
        tryToPlace(roomToPlace, roomGrid, posToPlaceAt, h, levelDescription, avaliableRoomMap, rooms, spawns);
      }
    }
  }

  for(let h = 0; h<levelDescription.width; h++){
    for(let room of avaliableRooms){
      room.left = room.max;
      if(!room.max){
        room.max = 100;
        room.left = room.max;
      }
    }
    for(let w = 0; w<levelDescription.height; w++){
      if(!canPlace(w, h, levelDescription, roomGrid)){
        continue;
      }
      let localAvaliableRooms = avaliableRooms.slice(0);
      while(localAvaliableRooms.length > 0){
        let index = Math.floor(random()*localAvaliableRooms.length);
        let roomToPlace = localAvaliableRooms[index];
        localAvaliableRooms.splice(index, 1);
        if(roomToPlace.left > 0 && tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns)){
          roomToPlace.left --;
          break;
        }
      }
    }
  }

  let elements = [];

  for(let room of rooms){
    room.generateWalls();
    elements = elements.concat(room.elements);
  }

  //maxx maxy
  let bounds = [-Infinity, -Infinity];

  for(let element of elements){
    if(element.pos.x > bounds[0]){
      bounds[0] = element.pos.x;
    }
    if(element.pos.y > bounds[1]){
      bounds[1] = element.pos.y;
    }
  }

  elements = elements.concat(makeTheWalls(bounds[0]-5, bounds[1]-5));
  //console.log(levelDescription.width, levelDescription.height, "stage dimensions");
  callback(elements, rooms, spawns, levelDescription.width, levelDescription.height);
}

/**
* makes the walls
* @param {number} width the width of the level
* @param {height} height the height of the area
* @return {Element[]} a list of the elements composing the wall
*/
function makeTheWalls(width, height){
  let midX = width/2;
  let midY = height/2;
  let bottom = new Element(midX, -5, width+20, 10);
  let top = new Element(midX, height + 5, width+20, 10);
  let left = new Element(-5, midY, 10, height);
  let right = new Element(width + 5, midY, 10, height);
  return [bottom, top, left, right];
}

/**
* Tries to place a room by checking its requirements and if none are violated placing it.
* @param {RoomDiscription} roomToPlace the room's description which we are trying to place.
* @param {Room[][]} roomGrid a 2d array of rooms
* @param {number} w the width position of the room
* @param {number} h the height position of the room
* @param {LevelDiscription} levelDiscription the discription of the level
* @param {Object} avaliableRoomMap a map of names of rooms to room discriptions
* @param {Room[]} rooms a list of rooms having been placed
* @returns {boolean} returns whether or not the room was sucessfully placed
*/
function tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms, spawns){
  let can = canPlace(w, h, levelDescription, roomGrid);
  if(!can){
    return false;
  }
  for(let location in roomToPlace.roomRequirements){
    if(location === "bottom"){
      can = canPlace(w, h-1, levelDescription, roomGrid);
    } else if(location === "top"){
      can = canPlace(w, h+1, levelDescription, roomGrid);
    } else if(location === "left"){
      can = canPlace(w-1, h, levelDescription, roomGrid);
    } else if(location === "right"){
      can = canPlace(w+1, h, levelDescription, roomGrid);
    }
    if(!can){
      break;
    }
  }
  if(!can){
    return false;
  } else {
    for(let location in roomToPlace.roomRequirements){
      let roomDefinition = avaliableRoomMap[roomToPlace.roomRequirements[location]];
      if(location === "bottom"){
        let room = new Room((w+0.5)*(roomToPlace.width+20), (h-0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w][h-1] = room;
        rooms.push(room);
      } else if(location === "top"){
        let room = new Room((w+0.5)*(roomToPlace.width+20), (h+1.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w][h+1] = room;
        rooms.push(room);
      } else if(location === "left"){
        let room = new Room((w-0.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w-1][h] = room;
        rooms.push(room);
      } else if(location === "right"){
        let room = new Room((w+1.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomDefinition, roomGrid);
        roomGrid[w+1][h] = room;
        rooms.push(room);
      }
    }
  }
  let room = new Room((w+0.5)*(roomToPlace.width+20), (h+0.5)*(roomToPlace.height+20), roomToPlace);
  roomGrid[w][h] = room;
  rooms.push(room);
  if(roomToPlace.spawn){
    let spawnX = roomToPlace.spawn.x + room.x;
    let spawnY = roomToPlace.spawn.y + room.y;
    spawns.push({x:spawnX, y:spawnY});
  }
  return true;
}

/**
* tells whether or not a room can be placed based on world size
* @param {number} x the x position of the room
* @param {number} y the y position of the room
* @param {LevelDiscription} levelDiscription the discription for the level
* @param {Room[][]} a 2d array of existing rooms
* @returns {boolean} returns whether the room would be in the world bounds.
*/
function canPlace(x, y, levelDescription, rooms){
  let can = true;
  can = can && x>=0;
  can = can && x<levelDescription.width;
  can = can && y>=0;
  can = can && y<levelDescription.height;
  can = can && !(rooms[x][y]);
  return can;
}

/**
* based on the size of the rooms tells whether one intersects any other room
* @param {Room} room the room to see if it intersects
* @param {Room[][]} rooms a 2d array of all rooms in the world
* @returns {boolean} returns whether or not the room intersects
*/
function roomIntersectsRooms(room, rooms){
  for(let roomToCheck of rooms){
    if(room.box.intersects(roomToCheck.box, roomToCheck.x- room.x, roomToCheck.y - room.y) !== 0){
      return true;
    }
  }
  return false;
}

/**
* based on the gateway and the room returns the x y position of the center of the gateway.
* @param {Object} gateway the gateway to check
* @param {String} gateway.location the location of the gateway top, right, left, bottom
* @param {Room} room the room to used a position for the gateways
* @returns {number[]} returns an array with the [x, y] positions of the gateway's center
*/
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

var cachedLevel = {};
var allDoneLoadingLevels = false;

/**
 * Caches all of the rooms that would be used in the level
 * @param {String[]} urls the urls to cache
 */
var loadAllToCache = function(urls){
  allDoneLoadingLevels = false;
  let numberLeft = urls.length;
  for(let url of urls){
    httpRequest(url, function(data){
      cachedLevel[url] = data;
      numberLeft --;
      if(numberLeft <= 0){
        allDoneLoadingLevels = true;
      }
    });
  }
}

/**
* makes an XMLHttpRequest with the given arguments at the url and calls the callback with the data
* @param {String} url the url to querry
* @param {Function} callback the callback function
* @param {Object} passArg the arguments to directly pass into the callback
*/
var httpRequest = function httpRequest(url, callback, passArg, random){
  if(cachedLevel[url]){
    callback(cachedLevel[url], passArg, random);
    return;
  } else {
  }
  let theHttpRequest = new XMLHttpRequest();
  theHttpRequest.onreadystatechange = function(){
    if (theHttpRequest.readyState === XMLHttpRequest.DONE) {
      if (theHttpRequest.status === 200) {
        callback(JSON.parse(theHttpRequest.responseText), passArg, random)
      }
    }
  };
  theHttpRequest.open('GET', url);
  theHttpRequest.setRequestHeader('Content-Type', 'text/json');
  theHttpRequest.send();
}

export default generateLevel;
