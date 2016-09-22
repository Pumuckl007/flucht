import TestClass from "./../src/TestClass.js";

var expect = require("chai").expect;

describe('TestClass', function(){
  it('should respond to querry ""',function(){
    let something = new TestClass();
    expect(something.getItem("")).to.equal(true);
    })
  })
