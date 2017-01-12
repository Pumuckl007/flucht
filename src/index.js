/*import NetworkConnection from "./NetworkConnection.js";
import Party from "./Party.js";

setTimeout(function(){
  var networkConnection = new NetworkConnection();
  window.netoworkConnection = networkConnection;
  var party = new Party(document.getElementById("Party Display"));
  networkConnection.registerHandler("leave", party);
  networkConnection.registerHandler("peers", party);
  networkConnection.registerHandler("join", party);
  window.connect = function(e){
    netoworkConnection.connect(e)
  };
   console.log("STarting");
   var test = new WebRTCConnection("ChannelName");
   test.doSomething();
}, 1)*/
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
   flucht.renderer.resize();
   animate();
 });

 window.keys = [];
 window.onkeyup = function(e) {keys[e.keyCode]=false;}
 window.onkeydown = function(e) {keys[e.keyCode]=true;}
