import Flucht from "./Flucht.js";
import AnimatedEntityRenderer from "./AnimatedEntityRenderer.js";
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
  animate();
});

window.keys = [];
window.onkeyup = function(e) {keys[e.keyCode]=false;}
window.onkeydown = function(e) {keys[e.keyCode]=true;}
