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
  httpRequest(urlToDescription, generate, callback, random);
}

/**
* generates the level with the given discription and callback
* @param {LevelDiscription} levelDescription the level discription object
* @param {Room[]} levelDescription.rooms the rooms of the level
* @param {function} callback the callback
*/
function generate(levelDescription, callback, random){
  let i = levelDescription.rooms.length;
  let avaliableRooms = [];
  let roomMinMax = {};
  for(let room of levelDescription.rooms){
    httpRequest(room.url, function(data){
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
    });
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

  avaliableSpots = [];
  for(let h = 0; h<levelDescription.height; h++){
    avaliableSpots.push(h);
  }
  for(let w = 0; w<levelDescription.width; w++){
    let localAvaliableSpots = avaliableSpots.slice(0);
    for(let roomName in roomMinMaxMap){
      let min = roomMinMaxMap[roomName].min;
      if(!min){
        continue;
      }
      for(let i = 0; i<min && localAvaliableSpots.length > 0; i++){
        let index = Math.floor(Math.random()*localAvaliableSpots.length);
        let posToPlaceAt = localAvaliableSpots[index];
        localAvaliableSpots.splice(index, 1);
        let roomToPlace = avaliableRoomMap[roomName];
        tryToPlace(roomToPlace, roomGrid, w, index, levelDescription, avaliableRoomMap, rooms);
      }
    }
  }

  for(let w = 0; w<levelDescription.width; w++){
    for(let h = 0; h<levelDescription.height; h++){
      if(!canPlace(w, h, levelDescription, roomGrid)){
        continue;
      }
      let localAvaliableRooms = avaliableRooms.slice(0);
      while(localAvaliableRooms.length > 0){
        let index = Math.floor(Math.random()*localAvaliableRooms.length);
        let roomToPlace = localAvaliableRooms[index];
        localAvaliableRooms.splice(index, 1);
        if(tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms)){
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

  callback(elements, rooms);
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
function tryToPlace(roomToPlace, roomGrid, w, h, levelDescription, avaliableRoomMap, rooms){
  let can = true;
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

/**
* makes an XMLHttpRequest with the given arguments at the url and calls the callback with the data
* @param {String} url the url to querry
* @param {Function} callback the callback function
* @param {Object} passArg the arguments to directly pass into the callback
*/
function httpRequest(url, callback, passArg, random){
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        callback(JSON.parse(httpRequest.responseText), passArg, random)
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.setRequestHeader('Content-Type', 'text/json');
  httpRequest.send();
}

export default generateLevel;
