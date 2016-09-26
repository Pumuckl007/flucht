import Box from "./../../src/Physics/Box.js";

var expect = require("chai").expect;

describe('Box Class', function(){
  beforeEach(function(){
    this.box1 = new Box(2, 2);
    this.box2 = new Box(4, 4);
  })
  it('should intresect with overlaping boxes in the X diretion',function(){
    expect(this.box2.intersects(this.box1, 2, 0.001)).to.equal(1);
  })
  it('should intresect with overlaping boxes in the Y diretion',function(){
    expect(this.box2.intersects(this.box1, -0.01, 2)).to.equal(2);
  })
  it('should intresect with overlaping boxes in the X&Y diretions',function(){
    expect(this.box1.intersects(this.box2, 1, 1)).to.equal(3);
  })
  it('should not intresect with non-overlaping boxes',function(){
    expect(this.box1.intersects(this.box2, 4, 4)).to.equal(0);
  })
  it('should not interset with non-overlaping boxes', function(){
    let boxA = new Box(64, 128);
    let boxB = new Box(8000, 20);
    expect(boxA.intersects(boxB, -4000, 74)).to.equal(0);
  })
  it('should intresect with overlaping boxes in the Y diretion',function(){
    let boxA = new Box(64, 128);
    let boxB = new Box(8000, 20);
    expect(boxB.intersects(boxA, 0, 50)).to.equal(2);
  })
});
