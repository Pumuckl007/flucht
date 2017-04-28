import LevelGenerator from "./../../src/Physics/LevelGenerator.js";

var expect = require("chai").expect;
var fs = require('fs');
var seedrandom = require('seedrandom');

class XMLTest {
  constructor(){
    this.path = "";
    this.responseText = "";
  }

  open(a, uri){
    this.path = uri;
  }

  setRequestHeader(){}

  send(){
    let self = this;
    fs.readFile("." + this.path, 'utf8', function(err, contents) {
      self.responseText = contents;
      self.readyState = XMLTest.DONE;
      self.status = 200;
      self.onreadystatechange();
    });

  }
}

global.XMLTest = XMLTest;
XMLTest.DONE = 1;
var gval = eval;
gval('var XMLHttpRequest = global.XMLTest');

var findRoom = function(rooms, x, y){
  for(let room of rooms){
    if(room.x === x && room.y === y){
      return room;
    }
  }
}
var isEqual = function(one, two){
  for(let roomOne of one){
    let roomTwo = findRoom(two, roomOne.x, roomOne.y);
    // console.log(roomOne, roomTwo);
    expect(roomOne.description.name).to.equal(roomTwo.description.name);
  }
}

var isNotEqual = function(one, two){
  let oneUnequal = false;
  for(let roomOne of one){
    let roomTwo = findRoom(two, roomOne.x, roomOne.y);
    // console.log(roomOne, roomTwo);
    oneUnequal = oneUnequal || roomOne.description.name !== roomTwo.description.name;
  }
  expect(oneUnequal).to.be.true;
}

describe('Level Generator', function(){
  it('should generate the same level given the same seeds',function(done){
    let other = false;
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom("test"));
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom("test"));
  });
  it('should generate the same level given the same random seed',function(done){
    let other = false;
    let random = seedrandom()();
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom(random));
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom(random));
  });
  it('should generate different levels given different seeds',function(done){
    let other = false;
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isNotEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom("1"));
    LevelGenerator("/levels/Level1.json", function(e, rooms){
      if(other){
        isNotEqual(rooms, other);
        done();
      } else {
        other = rooms;
      }
    }, seedrandom("3"));
  });
});
