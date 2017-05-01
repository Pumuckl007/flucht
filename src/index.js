import Flucht from "./Flucht.js";


/** Creates a new network Connection and runs the game*/
setTimeout(function(){
  var flucht = new Flucht();

  var animate = function animate(){
    requestAnimationFrame(animate);
    flucht.render();
  }
  requestAnimationFrame(animate);
  var updateFlucht = function update(){
    setTimeout(updateFlucht, 20);
    flucht.update();
  }
  setTimeout(updateFlucht, 20);

  document.addEventListener("DOMContentLoaded", function(event) {
    flucht.renderer.resize();
    animate();
  });

  flucht.createWorld();
  flucht.insertRunner();


  //  console.log("STarting");
  //  var test = new WebRTCConnection("ChannelName");
  //  test.doSomething();
}, 10)

/**
 * An array of keys that are pushed down if true and false if released.
 * The index is the ascii code of the charater.
 * @var {number[]} keys
 */
window.keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false;}
window.onkeydown = function(e) {keys[e.keyCode]=true;}
