import Flucht from "./Flucht.js";
var flucht = new Flucht();

function animate(){
  requestAnimationFrame(animate);
  flucht.render();
}

setTimeout(update, 20);
function update(){
  setTimeout(update, 20);
  flucht.update();
}

document.addEventListener("DOMContentLoaded", function(event) {
  flucht.start();
  flucht.addRunner();
  animate();
});

window.keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false;}
window.onkeydown = function(e) {keys[e.keyCode]=true;}
