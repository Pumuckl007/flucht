import NetworkConnection from "./NetworkConnection.js";
import PartyWorld from "./PartyWorld.js";

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
  window.connect = function(e){
    networkConnection.connect(e)
  };
  // console.log("STarting");
  // var test = new WebRTCConnection("ChannelName");
  // test.doSomething();
}, 1)
// import Flucht from "./Flucht.js";
//
// var flucht = new Flucht();
//
// function animate(){
//   requestAnimationFrame(animate);
//   flucht.render();
// }
// setTimeout(update, 20);
// function update(){
//   setTimeout(update, 20);
//   flucht.update();
// }
//
// document.addEventListener("DOMContentLoaded", function(event) {
//   flucht.renderer.resize();
//   animate();
// });
//
// window.keys = [];
// window.onkeyup = function(e) {keys[e.keyCode]=false;}
// window.onkeydown = function(e) {keys[e.keyCode]=true;}
