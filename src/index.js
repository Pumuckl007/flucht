import NetworkConnection from "./NetworkConnection.js";
import PartyWorld from "./PartyWorld.js";
import Flucht from "./Flucht.js";
import RemotePlayerController from "./RemotePlayerController.js";
import PacketManager from "./PacketManager.js";
import Packet from "./Packet.js";
import PacketTypes from "./PacketTypes.js";

/** Creates a new network Connection and runs the game*/
setTimeout(function(){
  var flucht = new Flucht();

  var animate = function animate(){
    requestAnimationFrame(animate);
    flucht.render();
  }
  var updateFlucht = function update(){
    setTimeout(updateFlucht, 20);
    flucht.update();
  }
  setTimeout(updateFlucht, 20);

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

  let pm = new PacketManager();
  let test = function(e, v){ pm.onWSMessage(e, v)}
  networkConnection.registerHandler("webRTCMessage", {
    onWSMessage: test
  });
  pm.addListener(PacketTypes.seed, flucht)
  let remotePlayerController = new RemotePlayerController(flucht.world, pm, flucht.runner);
  networkConnection.registerHandler("connectionEstablished", {onWSMessage:function(e, v){
    remotePlayerController.addRemotePlayerListener(v.id);
    if(v.offerer){
      pm.send(new Packet(false, v.id, PacketTypes.seed, {seed:flucht.seed}));
    }
  }});
  let update = function(){
    setTimeout(update, 100);
    remotePlayerController.update();
  }
  update();
  //  console.log("STarting");
  //  var test = new WebRTCConnection("ChannelName");
  //  test.doSomething();
}, 10)
