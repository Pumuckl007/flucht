import Flucht from "./Flucht.js";

var done = false;

/** Creates a new network Connection and runs the game*/
setTimeout(function(){
  var flucht = new Flucht();
  window.flucht = flucht;
  var animate = function animate(){
    if(done){
      return;
    }
    requestAnimationFrame(animate);
    flucht.render();
  }
  requestAnimationFrame(animate);
  var updateFlucht = function update(){
    if(done){
      return;
    }
    setTimeout(updateFlucht, 20);
    flucht.update();
  }
  setTimeout(updateFlucht, 20);

  document.addEventListener("DOMContentLoaded", function(event) {
    flucht.renderer.resize();
    animate();
  });

}, 10)
