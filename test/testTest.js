import TestClass from "./../src/TestClass.js";

var expect = require("chai").expect;

describe('TestClass', function(){
  it('should respond to querry ""',function(){
    let something = new TestClass();
    something.init(true);
    expect(something.getItem("")).to.be.true;
    })
  })
