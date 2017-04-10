import NetworkConnection from "./NetworkConnection.js";
import PartyWorld from "./PartyWorld.js";
import Flucht from "./Flucht.js";


setTimeout(function(){
  var networkConnection = new NetworkConnection();
  window.networkConnection = networkConnection;
  var partyWorld = new PartyWorld(document.getElementById("Party Display"), networkConnection);
  networkConnection.registerHandler("leave", partyWorld);
  networkConnection.registerHandler("peers", partyWorld);
  networkConnection.registerHandler("join", partyWorld);
  networkConnection.registerHandler("offer", partyWorld);
  networkConnection.registerHandler("answer", partyWorld);
  networkConnection.registerHandler("ice", partyWorld);
  networkConnection.registerHandler("connectionEstablished", partyWorld);
  window.connect = function(e){
    networkConnection.connect(e)
  };
  //  console.log("STarting");
  //  var test = new WebRTCConnection("ChannelName");
  //  test.doSomething();
}, 1)

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

 /**
  * An array of keys that are pushed down if true and false if released.
  * The index is the ascii code of the charater.
  * @var {number[]} keys
  */
 window.keys = [];
 window.onkeyup = function(e) {keys[e.keyCode]=false;}
 window.onkeydown = function(e) {keys[e.keyCode]=true;}
