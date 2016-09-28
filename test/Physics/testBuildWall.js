import BuildWall from "./../../src/Physics/BuildWall.js";
import Element from "./../../src/Physics/Elements/Element.js"

var expect = require("chai").expect;

describe('Room Build Wall', function(){
  it('should generate a solid segment in the X axis if no gateways',function(){
    let gateways = [];
    let wallSegments = BuildWall(-10, 110, true, gateways);
    expect(JSON.stringify(wallSegments[0])).to.equal(JSON.stringify(new Element(50, -5, 120, 10)));
  });
  it('should generate a solid segment in the Y axis if no gateways',function(){
    let gateways = [];
    let wallSegments = BuildWall(0, 100, false, gateways);
    expect(JSON.stringify(wallSegments[0])).to.equal(JSON.stringify(new Element(-5, 50, 10, 100)));
  });
  it('should generate two broken segments in the X axis if one gateway',function(){
    let gateways = [
      {
        "location": "left",
        "position": 50,
        "width": 200
      }];
    let wallSegments = BuildWall(-10, 410, true, gateways);
    let expected = [
      new Element(20, -5, 60, 10),
      new Element(330, -5, 160, 10)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
  it('should generate two broken segments in the Y axis if one gateway',function(){
    let gateways = [
      {
        "location": "left",
        "position": 50,
        "width": 200
      }];
    let wallSegments = BuildWall(0, 400, false, gateways);
    let expected = [
      new Element(-5, 25, 10, 50),
      new Element(-5, 325, 10, 150)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
  it('should generate three broken segments in the X axis if two gateways',function(){
    let gateways = [
      {
        "location": "left",
        "position": 40,
        "width": 100
      },
      {
        "location": "left",
        "position": 200,
        "width": 50
      }
    ];
    let wallSegments = BuildWall(0, 400, true, gateways);
    let expected = [
      new Element(20, -5, 40, 10),
      new Element(170, -5, 60, 10),
      new Element(325, -5, 150, 10)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
  it('should generate two broken segments in the X axis if two gateways overlapping',function(){
    let gateways = [
      {
        "location": "left",
        "position": 40,
        "width": 200
      },
      {
        "location": "left",
        "position": 200,
        "width": 50
      }
    ];
    let wallSegments = BuildWall(0, 400, true, gateways);
    let expected = [
      new Element(20, -5, 40, 10),
      new Element(325, -5, 150, 10)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
  it('should generate two broken segments in the X axis if two gateways with one over the start',function(){
    let gateways = [
      {
        "location": "left",
        "position": 0,
        "width": 100
      },
      {
        "location": "left",
        "position": 200,
        "width": 50
      }
    ];
    let wallSegments = BuildWall(0, 400, true, gateways);
    let expected = [
      new Element(150, -5, 100, 10),
      new Element(325, -5, 150, 10)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
  it('should generate two broken segments in the X axis if two gateways with one over the end',function(){
    let gateways = [
      {
        "location": "left",
        "position": 200,
        "width": 100
      },
      {
        "location": "left",
        "position": 380,
        "width": 50
      }
    ];
    let wallSegments = BuildWall(0, 400, true, gateways);
    let expected = [
      new Element(100, -5, 200, 10),
      new Element(340, -5, 80, 10)
    ]
    expect(JSON.stringify(wallSegments)).to.equal(JSON.stringify(expected));
  });
});
